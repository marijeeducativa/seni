#!/usr/bin/env node

/**
 * Script to verify environment configuration for deployment
 */

console.log('🔍 Verificando configuración de despliegue...\n');

// Check if running in Node.js environment
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

if (!isNode) {
    console.error('❌ Este script debe ejecutarse con Node.js');
    process.exit(1);
}

// Load .env file if it exists
try {
    const fs = require('fs');
    const path = require('path');

    const envPath = path.join(__dirname, '.env');

    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');

        console.log('📄 Archivo .env encontrado\n');

        const requiredVars = [
            'VITE_SUPABASE_URL',
            'VITE_SUPABASE_ANON_KEY',
            'VITE_API_URL'
        ];

        const foundVars = {};

        lines.forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const [, key, value] = match;
                foundVars[key.trim()] = value.trim();
            }
        });

        console.log('✅ Variables de entorno encontradas:');
        requiredVars.forEach(varName => {
            if (foundVars[varName]) {
                const value = foundVars[varName];
                const masked = value.length > 20 ? value.substring(0, 20) + '...' : value;
                console.log(`   ${varName}: ${masked}`);
            } else {
                console.log(`   ❌ ${varName}: NO CONFIGURADA`);
            }
        });

        console.log('\n📋 Instrucciones para Vercel:');
        console.log('   1. Ve a tu proyecto en Vercel Dashboard');
        console.log('   2. Settings → Environment Variables');
        console.log('   3. Agrega las siguientes variables:\n');

        requiredVars.forEach(varName => {
            if (foundVars[varName]) {
                console.log(`   ${varName}=${foundVars[varName]}`);
            } else {
                console.log(`   ${varName}=<valor-requerido>`);
            }
        });

        console.log('\n⚠️  IMPORTANTE:');
        console.log('   - VITE_API_URL debe ser la URL de tu Cloudflare Worker');
        console.log('   - Ejemplo: https://seni-api.tu-subdomain.workers.dev');
        console.log('   - NO incluyas una barra diagonal (/) al final\n');

    } else {
        console.log('⚠️  No se encontró archivo .env');
        console.log('   Crea un archivo .env basado en .env.example\n');
    }

} catch (error) {
    console.error('❌ Error al verificar configuración:', error.message);
    process.exit(1);
}

console.log('✨ Verificación completada\n');
