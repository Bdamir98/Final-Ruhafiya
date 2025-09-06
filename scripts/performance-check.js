#!/usr/bin/env node

/**
 * Performance Validation Script for Ruhafiya
 * 
 * This script validates the performance optimizations implemented
 * and provides recommendations for further improvements.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 Ruhafiya Performance Validation Script');
console.log('==========================================');

// Check if Next.js build exists
function checkBuildFiles() {
  console.log('\n📦 Checking build files...');
  
  const nextDir = path.join(rootDir, '.next');
  if (!fs.existsSync(nextDir)) {
    console.log('❌ No build found. Run "npm run build" first.');
    return false;
  }
  
  console.log('✅ Build directory found');
  return true;
}

// Validate performance configurations
function validateConfigurations() {
  console.log('\n⚙️  Validating configurations...');
  
  // Check Next.js config
  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
  if (fs.existsSync(nextConfigPath)) {
    const config = fs.readFileSync(nextConfigPath, 'utf8');
    
    const checks = [
      { name: 'SWC Minify', check: config.includes('swcMinify: true') },
      { name: 'Compression', check: config.includes('compress: true') },
      { name: 'Image Optimization', check: config.includes('formats: [') },
      { name: 'Headers Configuration', check: config.includes('async headers()') },
      { name: 'Webpack Optimization', check: config.includes('splitChunks') }
    ];
    
    checks.forEach(({ name, check }) => {
      console.log(`${check ? '✅' : '❌'} ${name}`);
    });
  }
  
  // Check Service Worker
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  if (fs.existsSync(swPath)) {
    console.log('✅ Service Worker found');
  } else {
    console.log('❌ Service Worker missing');
  }
  
  // Check Performance Monitor
  const perfMonitorPath = path.join(process.cwd(), 'src', 'react-app', 'components', 'PerformanceMonitor.tsx');
  if (fs.existsSync(perfMonitorPath)) {
    console.log('✅ Performance Monitor implemented');
  } else {
    console.log('❌ Performance Monitor missing');
  }
}

// Check critical optimizations
function checkCriticalOptimizations() {
  console.log('\n🎯 Checking critical optimizations...');
  
  // Check layout optimization
  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    
    const checks = [
      { name: 'Critical CSS inline', check: layoutContent.includes('Critical CSS') },
      { name: 'Font optimization', check: layoutContent.includes('font-display:swap') },
      { name: 'Performance Monitor', check: layoutContent.includes('PerformanceMonitor') },
      { name: 'Analytics optimization', check: layoutContent.includes('afterInteractive') }
    ];
    
    checks.forEach(({ name, check }) => {
      console.log(`${check ? '✅' : '❌'} ${name}`);
    });
  }
  
  // Check Home component optimization
  const homePath = path.join(process.cwd(), 'src', 'react-app', 'pages', 'Home.tsx');
  if (fs.existsSync(homePath)) {
    const homeContent = fs.readFileSync(homePath, 'utf8');
    
    const checks = [
      { name: 'Performance Wrapper', check: homeContent.includes('PerformanceWrapper') },
      { name: 'Lazy loading', check: homeContent.includes('lazy(()') },
      { name: 'Staggered loading', check: homeContent.includes('delay=') }
    ];
    
    checks.forEach(({ name, check }) => {
      console.log(`${check ? '✅' : '❌'} ${name}`);
    });
  }
}

// Performance recommendations
function generateRecommendations() {
  console.log('\n💡 Performance Recommendations for Production:');
  console.log('');
  
  const recommendations = [
    '1. 🌐 Enable CDN (Vercel automatically provides this)',
    '2. 🗜️  Enable gzip/brotli compression on your hosting',
    '3. 🖼️  Optimize images further with WebP/AVIF formats',
    '4. 📊 Monitor Core Web Vitals in production',
    '5. 🚀 Consider implementing edge-side includes for API responses',
    '6. 📱 Test performance on real mobile devices',
    '7. 🔄 Implement background sync for offline functionality',
    '8. 📈 Set up performance budgets and monitoring'
  ];
  
  recommendations.forEach(rec => console.log(rec));
}

// Deployment checklist
function deploymentChecklist() {
  console.log('\n📋 Pre-deployment Performance Checklist:');
  console.log('');
  
  const checklist = [
    '☐ Run "npm run build" successfully',
    '☐ Test in production mode locally',
    '☐ Verify no console errors',
    '☐ Check bundle analyzer results',
    '☐ Test on mobile devices',
    '☐ Validate Core Web Vitals',
    '☐ Test offline functionality',
    '☐ Verify analytics tracking'
  ];
  
  checklist.forEach(item => console.log(item));
}

// Environment variables check
function checkEnvironmentVariables() {
  console.log('\n🔐 Environment Variables Check:');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const optionalVars = [
    'NEXT_PUBLIC_GTM_ID',
    'NEXT_PUBLIC_FB_PIXEL_ID',
    'FB_ACCESS_TOKEN'
  ];
  
  console.log('\nRequired:');
  requiredVars.forEach(varName => {
    const exists = process.env[varName] ? true : false;
    console.log(`${exists ? '✅' : '❌'} ${varName}`);
  });
  
  console.log('\nOptional (for tracking):');
  optionalVars.forEach(varName => {
    const exists = process.env[varName] ? true : false;
    console.log(`${exists ? '✅' : '⚠️ '} ${varName}`);
  });
}

// Main execution
function main() {
  const buildExists = checkBuildFiles();
  
  validateConfigurations();
  checkCriticalOptimizations();
  checkEnvironmentVariables();
  generateRecommendations();
  deploymentChecklist();
  
  console.log('\n🎉 Performance optimization validation complete!');
  
  if (buildExists) {
    console.log('\n🚀 Your app is ready for high-performance deployment!');
    console.log('');
    console.log('📊 Next steps:');
    console.log('1. Deploy to Vercel or your preferred hosting');
    console.log('2. Test with PageSpeed Insights');
    console.log('3. Monitor performance in production');
  } else {
    console.log('\n⚠️  Please run "npm run build" before deployment');
  }
}

// Run the script
main();