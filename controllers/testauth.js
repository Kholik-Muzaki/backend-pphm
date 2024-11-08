const bcrypt = require('bcryptjs');

async function testPasswordComparison() {
    const passwordToTest = 'kholik'; // Replace with actual plaintext password
    const storedHash = '$2a$10$TBNqLQiLDXz8OlWGULtneeEzqI52kLmkyBj99fXNbGkpVCDC0jMqy'; // Replace with actual hash from database
    const newHash = await bcrypt.hash('kholik', 10);
    console.log(`New hash for 'kholik': ${newHash}`);
    console.log(`Original stored hash: ${storedHash}`);

    const isMatch = await bcrypt.compare(passwordToTest, storedHash);
    console.log(`Manual password comparison result: ${isMatch}`);  // Should output `true` if matching
}

testPasswordComparison();


