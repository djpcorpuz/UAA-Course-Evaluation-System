import api from "../api";

export const fetchEnrolledCourses = async () => {
    try {
        const resp = await api.get("/api/student/enrolled-courses");
        const result = resp.data;
        return result;
    } catch (error) {
        console.error("fetchedEnrolledCourses failed:", error)
        return [];
    }
}

export const fetchCourseSurveyQuestions = async (crn , term) => {
    try {
        const resp = await api.get(`/api/student/survey-questions/${crn}/${term}`);
        const result = resp.data;
        return result;
    } catch (error) {
        console.error("fetchCourseSurveyQuestions failed:", error);
        return [];
    }
}

export const submitCourseSurvey = async (data) => {
    try {
        const resp = await api.post("/api/student/submit-course-answers", data)
        const result = resp.data;
        return result;
    } catch (error) {
        console.error("submitCourseSurvey failed:", error);
        return error;
    }
}