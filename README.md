🥋 JudokasConnect

Train smarter. Compete better. Stay connected.

JudokasConnect is a full-stack web platform built to support Singapore’s judo community — helping athletes streamline their training, prepare for competitions, and connect with peers.
Developed as part of the SMU .Hack HEAP Programme (Top 5 Placement).

🌟 Overview

Judo is a niche and often under-resourced sport. Many teams rely on manual or fragmented systems for attendance, training feedback, and communication.
JudokasConnect aims to centralize these functions into one cohesive platform — combining technology, community, and sports science.

🚀 Key Features
🗓️ Training Management

Interactive attendance calendar for coaches and athletes to track participation.

Replaces manual polls with automated updates and reminders.

🎥 Video Hub

Centralized training video repository with a built-in comment section for feedback and discussion.

Prevents valuable footage from being buried in chat groups.

💬 Discussion Forum

Safe space for judokas to ask questions, share techniques, and learn collaboratively.

🧘‍♂️ Exercise & Nutrition Hub

Integrated Gemini API for personalized meal planning to support healthy weight management.

Curated exercise repository to supplement physical conditioning.

📰 Judo News Scraper

Live news updates pulled from the International Judo Federation via Cheerio web scraping, ensuring users stay informed.

🧠 Tech Stack
Layer	Technology
Frontend	Next.js (deployed on Vercel)
Backend	FastAPI (deployed on Render)
Database	Firebase
Styling	Tailwind CSS
Containerization	Docker
APIs	Gemini API (meal planner), Cheerio (news scraping)
🧩 Architecture

JudokasConnect follows a decoupled architecture — separating the frontend and backend for flexibility and scalability.

Note: Render’s free-tier backend enters sleep mode after inactivity, causing a cold-start delay (10–30 seconds) for the first API call.
