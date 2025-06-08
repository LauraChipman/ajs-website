const bcrypt = require('bcrypt');

// Replace this with your actual hash from MongoDB
const hash = "$2b$10$emHIk0BqwX.CojYjJMvROu7f2OTLw/Md8l2Ac6zclnPV1fF0k7ggW";

bcrypt.compare("admin123", hash).then(result => console.log("admin123 match:", result));
bcrypt.compare("password123", hash).then(result => console.log("password123 match:", result));
