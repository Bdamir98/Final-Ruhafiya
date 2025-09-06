import { createHash } from 'crypto';

export interface FraudDetectionResult {
  score: number;
  reasons: string[];
  isBlocked: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface OrderData {
  fullName: string;
  mobileNumber: string;
  fullAddress: string;
  productId: number;
  quantity: number;
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
}

export interface FraudSettings {
  detection: {
    enabled: boolean;
    autoBlock: boolean;
    scoreThreshold: number;
    duplicateOrderWindow: number;
    maxOrdersPerHour: number;
    maxOrdersPerDay: number;
  };
  rules: {
    duplicatePhone: { enabled: boolean; weight: number };
    duplicateAddress: { enabled: boolean; weight: number };
    rapidOrders: { enabled: boolean; weight: number };
    suspiciousPatterns: { enabled: boolean; weight: number };
    invalidPhone: { enabled: boolean; weight: number };
    vpnDetection: { enabled: boolean; weight: number };
    deviceFingerprint: { enabled: boolean; weight: number };
  };
  blacklist: {
    blockedPhones: string[];
    blockedIPs: string[];
    blockedKeywords: string[];
  };
  whitelist: {
    trustedPhones: string[];
    trustedIPs: string[];
    trustedDevices: string[];
  };
}

export class FraudDetector {
  private settings: FraudSettings;
  private supabase: any;

  constructor(settings: FraudSettings, supabase: any) {
    this.settings = settings;
    this.supabase = supabase;
  }

  async detectFraud(orderData: OrderData): Promise<FraudDetectionResult> {
    if (!this.settings.detection.enabled) {
      return {
        score: 0,
        reasons: [],
        isBlocked: false,
        riskLevel: 'low'
      };
    }

    let totalScore = 0;
    const reasons: string[] = [];

    // Check whitelist first
    if (this.isWhitelisted(orderData)) {
      return {
        score: 0,
        reasons: ['Whitelisted user'],
        isBlocked: false,
        riskLevel: 'low'
      };
    }

    // Check blacklist
    if (this.isBlacklisted(orderData)) {
      return {
        score: 100,
        reasons: ['Blacklisted user/IP/keyword detected'],
        isBlocked: true,
        riskLevel: 'critical'
      };
    }

    // Run fraud detection rules
    const checks = [
      this.checkDuplicatePhone(orderData),
      this.checkDuplicateAddress(orderData),
      this.checkRapidOrders(orderData),
      this.checkSuspiciousPatterns(orderData),
      this.checkInvalidPhone(orderData),
      this.checkVPN(orderData),
      this.checkDeviceFingerprint(orderData)
    ];

    const results = await Promise.all(checks);
    
    results.forEach(result => {
      if (result.detected) {
        totalScore += result.score;
        reasons.push(result.reason);
      }
    });

    const riskLevel = this.calculateRiskLevel(totalScore);
    const isBlocked = Boolean(this.settings.detection.autoBlock && totalScore >= this.settings.detection.scoreThreshold);

    return {
      score: Math.min(totalScore, 100),
      reasons,
      isBlocked,
      riskLevel
    };
  }

  private isWhitelisted(orderData: OrderData): boolean {
    const { trustedPhones, trustedIPs, trustedDevices } = this.settings.whitelist;
    
    return Boolean(
      trustedPhones.includes(orderData.mobileNumber) ||
      (orderData.ipAddress && trustedIPs.includes(orderData.ipAddress)) ||
      (orderData.deviceFingerprint && trustedDevices.includes(orderData.deviceFingerprint))
    );
  }

  private isBlacklisted(orderData: OrderData): boolean {
    const { blockedPhones, blockedIPs, blockedKeywords } = this.settings.blacklist;
    
    // Check blocked phones
    if (blockedPhones.includes(orderData.mobileNumber)) return true;
    
    // Check blocked IPs
    if (orderData.ipAddress && blockedIPs.includes(orderData.ipAddress)) return true;
    
    // Check blocked keywords in name/address
    const textToCheck = `${orderData.fullName} ${orderData.fullAddress}`.toLowerCase();
    return blockedKeywords.some(keyword => textToCheck.includes(keyword.toLowerCase()));
  }

  private async checkDuplicatePhone(orderData: OrderData) {
    if (!this.settings.rules.duplicatePhone.enabled) {
      return { detected: false, score: 0, reason: '' };
    }

    const windowStart = new Date();
    windowStart.setMinutes(windowStart.getMinutes() - this.settings.detection.duplicateOrderWindow);

    const { data: duplicates } = await this.supabase
      .from('orders')
      .select('id')
      .eq('mobile_number', orderData.mobileNumber)
      .gte('created_at', windowStart.toISOString());

    const count = duplicates?.length || 0;
    
    if (count > 0) {
      return {
        detected: true,
        score: this.settings.rules.duplicatePhone.weight + (count * 10),
        reason: `Duplicate phone number (${count} recent orders)`
      };
    }

    return { detected: false, score: 0, reason: '' };
  }

  private async checkDuplicateAddress(orderData: OrderData) {
    if (!this.settings.rules.duplicateAddress.enabled) {
      return { detected: false, score: 0, reason: '' };
    }

    const windowStart = new Date();
    windowStart.setMinutes(windowStart.getMinutes() - this.settings.detection.duplicateOrderWindow);

    // Check for similar addresses (fuzzy matching)
    const { data: orders } = await this.supabase
      .from('orders')
      .select('full_address')
      .gte('created_at', windowStart.toISOString());

    if (!orders) return { detected: false, score: 0, reason: '' };

    const similarAddresses = orders.filter((order: any) => 
      this.calculateSimilarity(orderData.fullAddress, order.full_address) > 0.8
    );

    if (similarAddresses.length > 0) {
      return {
        detected: true,
        score: this.settings.rules.duplicateAddress.weight,
        reason: `Similar address found (${similarAddresses.length} matches)`
      };
    }

    return { detected: false, score: 0, reason: '' };
  }

  private async checkRapidOrders(orderData: OrderData) {
    if (!this.settings.rules.rapidOrders.enabled) {
      return { detected: false, score: 0, reason: '' };
    }

    const hourAgo = new Date();
    hourAgo.setHours(hourAgo.getHours() - 1);

    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);

    // Check orders per hour
    const { data: hourlyOrders } = await this.supabase
      .from('orders')
      .select('id')
      .or(`mobile_number.eq.${orderData.mobileNumber},ip_address.eq.${orderData.ipAddress}`)
      .gte('created_at', hourAgo.toISOString());

    const hourlyCount = hourlyOrders?.length || 0;

    // Check orders per day
    const { data: dailyOrders } = await this.supabase
      .from('orders')
      .select('id')
      .or(`mobile_number.eq.${orderData.mobileNumber},ip_address.eq.${orderData.ipAddress}`)
      .gte('created_at', dayAgo.toISOString());

    const dailyCount = dailyOrders?.length || 0;

    if (hourlyCount >= this.settings.detection.maxOrdersPerHour) {
      return {
        detected: true,
        score: this.settings.rules.rapidOrders.weight + (hourlyCount * 5),
        reason: `Too many orders per hour (${hourlyCount})`
      };
    }

    if (dailyCount >= this.settings.detection.maxOrdersPerDay) {
      return {
        detected: true,
        score: this.settings.rules.rapidOrders.weight,
        reason: `Too many orders per day (${dailyCount})`
      };
    }

    return { detected: false, score: 0, reason: '' };
  }

  private checkSuspiciousPatterns(orderData: OrderData) {
    if (!this.settings.rules.suspiciousPatterns.enabled) {
      return { detected: false, score: 0, reason: '' };
    }

    const suspiciousPatterns = [
      /test|fake|spam|bot/i,
      /^(.)\1{4,}$/, // Repeated characters
      /^\d+$/, // Only numbers in name
      /^[a-z]+$/i, // Only single case letters
    ];

    const textToCheck = `${orderData.fullName} ${orderData.fullAddress}`;
    const matchedPatterns = suspiciousPatterns.filter(pattern => pattern.test(textToCheck));

    if (matchedPatterns.length > 0) {
      return {
        detected: true,
        score: this.settings.rules.suspiciousPatterns.weight * matchedPatterns.length,
        reason: `Suspicious patterns detected (${matchedPatterns.length} patterns)`
      };
    }

    return { detected: false, score: 0, reason: '' };
  }

  private checkInvalidPhone(orderData: OrderData) {
    if (!this.settings.rules.invalidPhone.enabled) {
      return { detected: false, score: 0, reason: '' };
    }

    const phone = orderData.mobileNumber.replace(/\D/g, '');
    
    // Bangladesh phone validation
    const validPatterns = [
      /^01[3-9]\d{8}$/, // Standard BD mobile
      /^8801[3-9]\d{8}$/, // With country code
    ];

    const isValid = validPatterns.some(pattern => pattern.test(phone));
    
    if (!isValid) {
      return {
        detected: true,
        score: this.settings.rules.invalidPhone.weight,
        reason: 'Invalid phone number format'
      };
    }

    return { detected: false, score: 0, reason: '' };
  }

  private async checkVPN(orderData: OrderData) {
    if (!this.settings.rules.vpnDetection.enabled || !orderData.ipAddress) {
      return { detected: false, score: 0, reason: '' };
    }

    // Simple VPN detection (you can integrate with services like IPQualityScore)
    const suspiciousRanges = [
      /^10\./, // Private IP
      /^192\.168\./, // Private IP
      /^172\.(1[6-9]|2\d|3[01])\./, // Private IP
      /^127\./, // Localhost
    ];

    const isSuspicious = suspiciousRanges.some(range => range.test(orderData.ipAddress!));
    
    if (isSuspicious) {
      return {
        detected: true,
        score: this.settings.rules.vpnDetection.weight,
        reason: 'Suspicious IP address detected'
      };
    }

    return { detected: false, score: 0, reason: '' };
  }

  private async checkDeviceFingerprint(orderData: OrderData) {
    if (!this.settings.rules.deviceFingerprint.enabled || !orderData.deviceFingerprint) {
      return { detected: false, score: 0, reason: '' };
    }

    const windowStart = new Date();
    windowStart.setHours(windowStart.getHours() - 24);

    const { data: deviceOrders } = await this.supabase
      .from('orders')
      .select('id, mobile_number')
      .eq('device_fingerprint', orderData.deviceFingerprint)
      .gte('created_at', windowStart.toISOString());

    if (!deviceOrders) return { detected: false, score: 0, reason: '' };

    // Check if same device used with different phone numbers
    const uniquePhones = new Set(deviceOrders.map((order: any) => order.mobile_number));
    
    if (uniquePhones.size > 3) {
      return {
        detected: true,
        score: this.settings.rules.deviceFingerprint.weight,
        reason: `Device used with multiple phone numbers (${uniquePhones.size})`
      };
    }

    return { detected: false, score: 0, reason: '' };
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private calculateRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  // Generate device fingerprint from user agent and other factors
  static generateDeviceFingerprint(userAgent: string, additionalData: any = {}): string {
    const data = {
      userAgent,
      ...additionalData,
      timestamp: Math.floor(Date.now() / (1000 * 60 * 60)) // Hour-based to allow some variation
    };
    
    return createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex')
      .substring(0, 16);
  }
}
