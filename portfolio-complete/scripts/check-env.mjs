const required=["NEXT_PUBLIC_SITE_URL","NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY","SUPABASE_SERVICE_ROLE_KEY","CONTACT_RATE_LIMIT_SALT"];
const missing=required.filter((key)=>!process.env[key]);
if(missing.length){console.error(`Missing environment variables: ${missing.join(", ")}`);process.exit(1);}
console.log("All required production environment variables are present.");
