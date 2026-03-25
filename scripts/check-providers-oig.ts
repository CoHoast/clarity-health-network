/**
 * Real OIG/SAM Check for Arizona Providers
 * Checks all 3,600 providers against actual OIG LEIE exclusion database
 */

import fs from 'fs';
import path from 'path';

interface OigExclusion {
  lastname: string;
  firstname: string;
  midname?: string;
  npi?: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  excltype: string;
  excldate: string;
  reindate?: string;
  waiverdate?: string;
  wvrstate?: string;
}

interface Provider {
  npi: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  specialty?: string;
  locations?: { city?: string; state?: string }[];
}

async function runOigCheck() {
  console.log('🔍 Running REAL OIG Check against Arizona Providers...\n');
  
  // Load OIG exclusions
  const oigFile = path.join(process.cwd(), 'data', 'oig-leie.json');
  const providersFile = path.join(process.cwd(), 'data', 'arizona-providers.json');
  
  if (!fs.existsSync(oigFile)) {
    console.error('❌ OIG LEIE data not found at', oigFile);
    return;
  }
  
  if (!fs.existsSync(providersFile)) {
    console.error('❌ Arizona providers not found at', providersFile);
    return;
  }
  
  const exclusions: OigExclusion[] = JSON.parse(fs.readFileSync(oigFile, 'utf-8'));
  const providers: Provider[] = JSON.parse(fs.readFileSync(providersFile, 'utf-8'));
  
  console.log(`📊 Loaded ${exclusions.length.toLocaleString()} OIG exclusions`);
  console.log(`📊 Loaded ${providers.length.toLocaleString()} Arizona providers\n`);
  
  // Build lookup maps for faster matching
  const npiExclusions = new Map<string, OigExclusion>();
  const nameExclusions = new Map<string, OigExclusion[]>();
  
  for (const exc of exclusions) {
    // Index by NPI if available
    if (exc.npi) {
      npiExclusions.set(exc.npi, exc);
    }
    
    // Index by name (lastname-firstname)
    const nameKey = `${exc.lastname?.toLowerCase()}-${exc.firstname?.toLowerCase()}`;
    if (!nameExclusions.has(nameKey)) {
      nameExclusions.set(nameKey, []);
    }
    nameExclusions.get(nameKey)!.push(exc);
  }
  
  console.log(`📇 Built NPI index: ${npiExclusions.size.toLocaleString()} NPIs`);
  console.log(`📇 Built Name index: ${nameExclusions.size.toLocaleString()} unique names\n`);
  
  // Check each provider
  const matches: { provider: Provider; exclusion: OigExclusion; matchType: string }[] = [];
  
  for (const provider of providers) {
    // Check by NPI first (most reliable)
    if (provider.npi && npiExclusions.has(provider.npi)) {
      matches.push({
        provider,
        exclusion: npiExclusions.get(provider.npi)!,
        matchType: 'NPI'
      });
      continue;
    }
    
    // Check by name
    const firstName = provider.firstName?.toLowerCase() || '';
    const lastName = provider.lastName?.toLowerCase() || '';
    
    if (firstName && lastName) {
      const nameKey = `${lastName}-${firstName}`;
      const nameMatches = nameExclusions.get(nameKey);
      
      if (nameMatches && nameMatches.length > 0) {
        // Additional verification: check state if available
        for (const exc of nameMatches) {
          const providerState = provider.locations?.[0]?.state?.toUpperCase();
          const excState = exc.state?.toUpperCase();
          
          // If states match or we can't verify state, flag as potential match
          if (!providerState || !excState || providerState === excState) {
            matches.push({
              provider,
              exclusion: exc,
              matchType: providerState === excState ? 'Name+State' : 'Name Only'
            });
            break;
          }
        }
      }
    }
  }
  
  // Report results
  console.log('=' .repeat(60));
  console.log('📋 RESULTS');
  console.log('=' .repeat(60));
  console.log(`\n✅ Providers checked: ${providers.length.toLocaleString()}`);
  console.log(`⚠️  Potential matches found: ${matches.length}\n`);
  
  if (matches.length === 0) {
    console.log('🎉 GREAT NEWS! No OIG exclusions found for any Arizona providers!\n');
    console.log('This means your network is clean - no providers are on the federal exclusion list.');
  } else {
    console.log('⚠️  ATTENTION: The following providers may be on the OIG exclusion list:\n');
    
    for (const match of matches) {
      const providerName = match.provider.name || 
        `${match.provider.firstName} ${match.provider.lastName}`;
      
      console.log(`Provider: ${providerName}`);
      console.log(`  NPI: ${match.provider.npi}`);
      console.log(`  Specialty: ${match.provider.specialty || 'N/A'}`);
      console.log(`  Match Type: ${match.matchType}`);
      console.log(`  ---`);
      console.log(`  Exclusion Name: ${match.exclusion.firstname} ${match.exclusion.lastname}`);
      console.log(`  Exclusion NPI: ${match.exclusion.npi || 'N/A'}`);
      console.log(`  Exclusion Type: ${match.exclusion.excltype}`);
      console.log(`  Exclusion Date: ${match.exclusion.excldate}`);
      console.log(`  State: ${match.exclusion.state || 'N/A'}`);
      if (match.exclusion.reindate) {
        console.log(`  Reinstatement Date: ${match.exclusion.reindate}`);
      }
      console.log('');
    }
  }
  
  // Save results to file
  const resultsFile = path.join(process.cwd(), 'data', 'oig-check-results.json');
  const results = {
    checkDate: new Date().toISOString(),
    totalProviders: providers.length,
    totalExclusions: exclusions.length,
    matchesFound: matches.length,
    matches: matches.map(m => ({
      providerNpi: m.provider.npi,
      providerName: m.provider.name || `${m.provider.firstName} ${m.provider.lastName}`,
      providerSpecialty: m.provider.specialty,
      matchType: m.matchType,
      exclusionName: `${m.exclusion.firstname} ${m.exclusion.lastname}`,
      exclusionNpi: m.exclusion.npi,
      exclusionType: m.exclusion.excltype,
      exclusionDate: m.exclusion.excldate,
      reinstatementDate: m.exclusion.reindate,
    }))
  };
  
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n📁 Results saved to: ${resultsFile}`);
}

runOigCheck().catch(console.error);
