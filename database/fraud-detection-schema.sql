-- Fraud Detection Database Schema
-- Add these columns to existing orders table and create new tables for fraud management

-- Add fraud detection columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fraud_score INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fraud_reasons TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'low';

-- Create fraud_alerts table for real-time notifications
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id SERIAL PRIMARY KEY,
    alert_id TEXT UNIQUE NOT NULL,
    order_id INTEGER REFERENCES orders(id),
    order_number TEXT NOT NULL,
    fraud_score INTEGER NOT NULL,
    risk_level TEXT NOT NULL,
    reasons TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fraud_patterns table for tracking suspicious patterns
CREATE TABLE IF NOT EXISTS fraud_patterns (
    id SERIAL PRIMARY KEY,
    pattern_type TEXT NOT NULL, -- 'phone', 'address', 'ip', 'device'
    pattern_value TEXT NOT NULL,
    detection_count INTEGER DEFAULT 1,
    first_detected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_detected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fraud_whitelist table for trusted entities
CREATE TABLE IF NOT EXISTS fraud_whitelist (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'phone', 'ip', 'device'
    entity_value TEXT NOT NULL,
    reason TEXT,
    added_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(entity_type, entity_value)
);

-- Create fraud_blacklist table for blocked entities
CREATE TABLE IF NOT EXISTS fraud_blacklist (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'phone', 'ip', 'device', 'keyword'
    entity_value TEXT NOT NULL,
    reason TEXT,
    added_by TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(entity_type, entity_value)
);

-- Create fraud_logs table for audit trail
CREATE TABLE IF NOT EXISTS fraud_logs (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    action TEXT NOT NULL, -- 'detected', 'flagged', 'blocked', 'whitelisted'
    details JSONB,
    performed_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_fraud_score ON orders(fraud_score);
CREATE INDEX IF NOT EXISTS idx_orders_is_flagged ON orders(is_flagged);
CREATE INDEX IF NOT EXISTS idx_orders_risk_level ON orders(risk_level);
CREATE INDEX IF NOT EXISTS idx_orders_ip_address ON orders(ip_address);
CREATE INDEX IF NOT EXISTS idx_orders_device_fingerprint ON orders(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_order_id ON fraud_alerts(order_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_is_read ON fraud_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_fraud_patterns_pattern_type ON fraud_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_fraud_patterns_pattern_value ON fraud_patterns(pattern_value);
CREATE INDEX IF NOT EXISTS idx_fraud_whitelist_entity ON fraud_whitelist(entity_type, entity_value);
CREATE INDEX IF NOT EXISTS idx_fraud_blacklist_entity ON fraud_blacklist(entity_type, entity_value);

-- Insert some default blacklist entries
INSERT INTO fraud_blacklist (entity_type, entity_value, reason, added_by) VALUES
('keyword', 'test', 'Common test keyword', 'system'),
('keyword', 'fake', 'Common fake keyword', 'system'),
('keyword', 'spam', 'Common spam keyword', 'system'),
('keyword', 'bot', 'Bot indicator', 'system'),
('keyword', 'dummy', 'Dummy data indicator', 'system')
ON CONFLICT (entity_type, entity_value) DO NOTHING;

-- Create trigger to update fraud_patterns automatically
CREATE OR REPLACE FUNCTION update_fraud_patterns()
RETURNS TRIGGER AS $$
BEGIN
    -- Update pattern for phone numbers with high fraud scores
    IF NEW.fraud_score >= 70 AND NEW.mobile_number IS NOT NULL THEN
        INSERT INTO fraud_patterns (pattern_type, pattern_value, detection_count, last_detected)
        VALUES ('phone', NEW.mobile_number, 1, NOW())
        ON CONFLICT (pattern_type, pattern_value) 
        DO UPDATE SET 
            detection_count = fraud_patterns.detection_count + 1,
            last_detected = NOW();
    END IF;
    
    -- Update pattern for IP addresses with high fraud scores
    IF NEW.fraud_score >= 70 AND NEW.ip_address IS NOT NULL THEN
        INSERT INTO fraud_patterns (pattern_type, pattern_value, detection_count, last_detected)
        VALUES ('ip', NEW.ip_address, 1, NOW())
        ON CONFLICT (pattern_type, pattern_value) 
        DO UPDATE SET 
            detection_count = fraud_patterns.detection_count + 1,
            last_detected = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on orders table
DROP TRIGGER IF EXISTS fraud_pattern_trigger ON orders;
CREATE TRIGGER fraud_pattern_trigger
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_fraud_patterns();

-- Create function to clean old fraud alerts (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_fraud_alerts()
RETURNS void AS $$
BEGIN
    DELETE FROM fraud_alerts 
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to get fraud statistics
CREATE OR REPLACE FUNCTION get_fraud_statistics(timeframe_hours INTEGER DEFAULT 24)
RETURNS TABLE(
    total_orders BIGINT,
    flagged_orders BIGINT,
    high_risk_orders BIGINT,
    blocked_orders BIGINT,
    fraud_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE is_flagged = true) as flagged_orders,
        COUNT(*) FILTER (WHERE fraud_score >= 70) as high_risk_orders,
        COUNT(*) FILTER (WHERE status = 'blocked') as blocked_orders,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(*) FILTER (WHERE is_flagged = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
            ELSE 0
        END as fraud_rate
    FROM orders 
    WHERE created_at >= NOW() - (timeframe_hours || ' hours')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Create fraud_unblock_history table for tracking unblock actions
CREATE TABLE IF NOT EXISTS fraud_unblock_history (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(20) NOT NULL,
    entity_value VARCHAR(255) NOT NULL,
    original_reason TEXT,
    unblock_reason TEXT NOT NULL,
    notes TEXT,
    unblocked_by VARCHAR(100) NOT NULL,
    unblocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add additional columns to fraud_blacklist for better tracking
ALTER TABLE fraud_blacklist ADD COLUMN IF NOT EXISTS unblock_count INTEGER DEFAULT 0;
ALTER TABLE fraud_blacklist ADD COLUMN IF NOT EXISTS last_unblocked_at TIMESTAMP;
ALTER TABLE fraud_blacklist ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE fraud_blacklist ADD COLUMN IF NOT EXISTS blocked_by VARCHAR(100) DEFAULT 'system';
ALTER TABLE fraud_blacklist ADD COLUMN IF NOT EXISTS auto_blocked BOOLEAN DEFAULT true;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fraud_unblock_history_entity ON fraud_unblock_history(entity_type, entity_value);
CREATE INDEX IF NOT EXISTS idx_fraud_unblock_history_date ON fraud_unblock_history(unblocked_at);
CREATE INDEX IF NOT EXISTS idx_fraud_blacklist_tracking ON fraud_blacklist(unblock_count, last_unblocked_at);
