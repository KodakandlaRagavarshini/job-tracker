const fs = require('fs');
const pdfParse = require('pdf-parse');

const extractKeywords = (text) => {
    if (!text) return [];
    // Basic extraction: get all words longer than 3 chars, converting to lowercase
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const stopWords = new Set(['and', 'the', 'for', 'with', 'this', 'that', 'you', 'your', 'are', 'can', 'has', 'have']);
    return [...new Set(words.filter(w => !stopWords.has(w)))];
};

const analyzeResume = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const file = req.file;

        if (!jobDescription) {
            return res.status(400).json({ message: 'Job description is required.' });
        }

        if (!file) {
            return res.status(400).json({ message: 'Resume document is required.' });
        }

        // Determine file type. Currently we support pdf.
        let resumeText = '';
        if (file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(file.path);
            const data = await pdfParse(dataBuffer);
            resumeText = data.text;
        } else {
            // For doc/docx, as fallback we just read the buffer as text or simulate it.
            return res.status(400).json({ message: 'Currently only PDF resumes are supported for analysis.' });
        }

        const jobKeywords = extractKeywords(jobDescription);
        const resumeKeywords = extractKeywords(resumeText);
        
        let matchCount = 0;
        const missingKeywords = [];

        jobKeywords.forEach(jk => {
            if (resumeKeywords.includes(jk)) {
                matchCount++;
            } else {
                missingKeywords.push(jk);
            }
        });

        const keywordDensity = jobKeywords.length > 0 ? (matchCount / jobKeywords.length) * 100 : 0;
        
        // Calculate score
        const score = Math.min(100, Math.round((keywordDensity * 0.7) + 30)); // base 30
        const skillsMatch = Math.min(100, Math.round(keywordDensity));
        const keywordMatch = Math.min(100, Math.round(keywordDensity + (Math.random() * 10 - 5)));
        
        // Formatting score based on extracted text length roughly
        const formatting = Math.min(100, resumeText.length > 500 ? 90 + Math.floor(Math.random() * 10) : 50);

        // Recommendations
        const recommendations = [];
        if (missingKeywords.length > 0) {
            recommendations.push(`Consider adding these missing keywords: ${missingKeywords.slice(0, 5).join(', ')}.`);
        } else {
            recommendations.push("Great job! Your resume covers all key terms from the job description.");
        }
        
        if (resumeText.length < 1000) {
             recommendations.push("Your resume is quite brief. Ensure you elaborate on your experience with measurable metrics.");
        }

        res.json({
            score,
            skillsMatch,
            keywordMatch,
            formatting,
            recommendations
        });
    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ message: 'Failed to analyze resume. Ensure it is a valid text-based PDF.' });
    }
};

module.exports = { analyzeResume };
