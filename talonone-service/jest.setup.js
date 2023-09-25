const mockEnvironmentVariables = () => {
    process.env.CTP_CLIENT_ID = 'xxxxxxxxxxxxxxxxxxxxxxxx';
    process.env.CTP_CLIENT_SECRET = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    process.env.CTP_PROJECT_KEY = 'xxxxxxxxxxx';
    process.env.CTP_SCOPE = 'xxxxxxxxxxx';
    process.env.CTP_REGION = 'us-central1.gcp';
};

mockEnvironmentVariables();
