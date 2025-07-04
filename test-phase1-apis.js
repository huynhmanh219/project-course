const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

const STUDENT_CREDENTIALS = {
    email: "student@example.com", 
    password: "password123"
};

let studentToken = "";

async function testAPIs() {
    console.log(" Testing Phase 1 APIs...\n");

    try {
        console.log("1. Testing Student Login...");
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, STUDENT_CREDENTIALS);
        
        if (loginResponse.data.status === "success") {
            studentToken = loginResponse.data.data.token;
            console.log(" Login successful");
            console.log(`   Token: ${studentToken.substring(0, 20)}...`);
        } else {
            console.log(" Login failed");
            return;
        }

        console.log("\n2. Testing GET /students/me/classes...");
        try {
            const classesResponse = await axios.get(`${BASE_URL}/students/me/classes`, {
                headers: { Authorization: `Bearer ${studentToken}` }
            });
            
            if (classesResponse.data.status === "success") {
                console.log(" Student classes API working");
                console.log(`   Found ${classesResponse.data.data.enrollments.length} classes`);
                
                if (classesResponse.data.data.enrollments.length > 0) {
                    const firstClass = classesResponse.data.data.enrollments[0];
                    const classId = firstClass.courseSection.id;
                    console.log(`   First class ID: ${classId}`);
                }
            }
        } catch (error) {
            console.log(" Student classes API failed:", error.response?.status, error.response?.data?.message);
        }

    } catch (error) {
        console.log(" Test failed:", error.message);
    }

    console.log("\n Phase 1 API Testing Complete");
}

testAPIs();
