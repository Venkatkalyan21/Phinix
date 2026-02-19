from agents.ai_helper import ask_gemini

class AgentPipeline:
    """
    Multi-agent orchestration pipeline.
    Chains: Resume → Career → Skill Gap → Roadmap → Interview Coach
    Each agent receives context from the previous one.
    """

    def __init__(self, resume_text: str, target_role: str):
        self.resume_text = resume_text
        self.target_role = target_role
        self.results = {}

    def run_resume_agent(self) -> str:
        prompt = f"""You are the Resume Agent in a multi-agent career AI system.

Analyze this resume for the target role: "{self.target_role}"

Resume:
{self.resume_text}

Provide a structured evaluation:
1. Resume Score (0-100)
2. Top 3 Strengths
3. Top 3 Weaknesses
4. ATS Score estimate
5. Key missing keywords for {self.target_role}

Be concise. Use bullet points."""
        result = ask_gemini(prompt)
        self.results["resume_agent"] = result
        return result

    def run_career_agent(self) -> str:
        resume_context = self.results.get("resume_agent", "")
        prompt = f"""You are the Career Intelligence Agent in a multi-agent career AI system.

Based on this resume analysis:
{resume_context}

Target Role: {self.target_role}

Provide:
1. Career Path Recommendation (best 2 paths)
2. Market Demand for {self.target_role} (High/Medium/Low + reason)
3. Alternative roles to consider
4. Timeline to reach {self.target_role}
5. Top 3 companies to target

Be concise. Use bullet points."""
        result = ask_gemini(prompt)
        self.results["career_agent"] = result
        return result

    def run_skill_gap_agent(self) -> str:
        resume_context = self.results.get("resume_agent", "")
        career_context = self.results.get("career_agent", "")
        prompt = f"""You are the Skill Gap Agent in a multi-agent career AI system.

Resume Analysis: {resume_context}
Career Intelligence: {career_context}
Target Role: {self.target_role}

Identify:
1. Current Skills (extracted from resume)
2. Required Skills for {self.target_role} (top 10)
3. Missing Skills (priority order)
4. Skill Gap Score (0-100, higher = bigger gap)
5. Quick wins (skills to learn in < 2 weeks)

Be concise. Use bullet points."""
        result = ask_gemini(prompt)
        self.results["skill_gap_agent"] = result
        return result

    def run_roadmap_agent(self) -> str:
        skill_context = self.results.get("skill_gap_agent", "")
        prompt = f"""You are the Roadmap Planner Agent in a multi-agent career AI system.

Skill Gap Analysis: {skill_context}
Target Role: {self.target_role}

Create a 12-week learning roadmap:
- Week 1-2: [Topic] + Mini Project
- Week 3-4: [Topic] + Mini Project
- Week 5-6: [Topic] + Mini Project
- Week 7-8: [Topic] + Mini Project
- Week 9-10: [Topic] + Mini Project
- Week 11-12: [Topic] + Portfolio Project

Also suggest 3 free resources (YouTube/Coursera/GitHub).
Be concise and specific."""
        result = ask_gemini(prompt)
        self.results["roadmap_agent"] = result
        return result

    def run_interview_agent(self) -> str:
        skill_context = self.results.get("skill_gap_agent", "")
        prompt = f"""You are the Interview Coach Agent in a multi-agent career AI system.

Target Role: {self.target_role}
Skill Profile: {skill_context}

Generate:
1. Top 5 Technical Interview Questions for {self.target_role}
2. Top 3 Behavioral Questions (STAR format)
3. Common Mistakes candidates make
4. Interview Preparation Tips (top 5)
5. Estimated Interview Difficulty (Easy/Medium/Hard)

Be concise. Use bullet points."""
        result = ask_gemini(prompt)
        self.results["interview_agent"] = result
        return result

    def run_all(self) -> dict:
        """Run all agents in sequence and return combined results."""
        self.run_resume_agent()
        self.run_career_agent()
        self.run_skill_gap_agent()
        self.run_roadmap_agent()
        self.run_interview_agent()
        return self.results
