const express = require('express');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;

// Get server IP addresses
function getServerIPs() {
    const networkInterfaces = os.networkInterfaces();
    const ipAddresses = {};
    
    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            // Skip internal and non-IPv4 addresses
            if (!iface.internal && iface.family === 'IPv4') {
                if (!ipAddresses[interfaceName]) {
                    ipAddresses[interfaceName] = [];
                }
                ipAddresses[interfaceName].push(iface.address);
            }
        }
    }
    
    return ipAddresses;
}

// Root endpoint
app.get('/',async (req, res) => {
    const hostname = os.hostname();
    const ipAddresses = getServerIPs();
    
    // Create HTML response with server information
    const html = `${Object.entries(ipAddresses).map(([interface, ips]) => `<div><strong>${interface}:</strong> ${ips.join(', ')}</div>`
                ).join('')}
  
    `;
    
    res.send(html);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
