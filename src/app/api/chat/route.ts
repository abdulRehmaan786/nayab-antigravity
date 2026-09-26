import { NextRequest, NextResponse } from "next/server";
import { findSchoolKnowledge, SCHOOL_INFO } from "@/lib/school-knowledge";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { reply: "Hello! How can I assist you with Nayab English Grammer High School Mirwah today?" },
        { status: 400 }
      );
    }

    const cleanMsg = message.trim();

    // 1. Direct Grounded Knowledge Match
    const match = findSchoolKnowledge(cleanMsg);

    // If asking about latest announcement or recent news, enrich with live DB data
    const isHolidayOrNewsQuery =
      cleanMsg.toLowerCase().includes("holiday") ||
      cleanMsg.toLowerCase().includes("announcement") ||
      cleanMsg.toLowerCase().includes("notice") ||
      cleanMsg.toLowerCase().includes("event");

    if (isHolidayOrNewsQuery) {
      try {
        const latestAnnouncements = await db.announcement.findMany({
          orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
          take: 2,
        });

        if (latestAnnouncements.length > 0) {
          const liveNoticesSummary = latestAnnouncements
            .map((a) => `• ${a.title} (${a.date}): ${a.content}`)
            .join("\n\n");

          return NextResponse.json({
            ok: true,
            reply: `Here are the latest official announcements and schedule notices from Nayab English Grammer High School Mirwah:\n\n${liveNoticesSummary}\n\nYou can also browse all notices on our Announcements board.`,
            actionLink: {
              label: "View All Announcements",
              href: "/announcements",
            },
          });
        }
      } catch (e) {
        console.error("Error fetching live announcements in chat:", e);
      }
    }

    if (match) {
      return NextResponse.json({
        ok: true,
        reply: match.answer,
        actionLink: match.actionLink || null,
      });
    }

    // Check for roll number direct query in chat (e.g., "check roll 101" or "roll number 101")
    const rollPattern = /(?:roll|roll\s*no|roll\s*number)\s*(?:is|#|:)?\s*(\d{1,4})/i;
    const rollMatch = cleanMsg.match(rollPattern);

    if (rollMatch && rollMatch[1]) {
      const detectedRoll = rollMatch[1];
      // Try to look up the student in DB
      try {
        const student = await db.student.findFirst({
          where: { rollNumber: detectedRoll },
          include: {
            results: { take: 1, orderBy: { createdAt: "desc" } },
            fees: { take: 1, orderBy: { createdAt: "desc" } },
          },
        });

        if (student) {
          const feeStatus = student.fees[0] ? student.fees[0].status : "Not available";
          const resultGrade = student.results[0] ? `${student.results[0].percentage}% (Grade ${student.results[0].overallGrade})` : "Pending publication";

          return NextResponse.json({
            ok: true,
            reply: `Found record for **${student.name}** (${student.className}, Section ${student.section}):\n• Latest Result: ${resultGrade}\n• Current Fee Status: ${feeStatus}\n\nYou can view and print the complete official report card via our Result Lookup portal.`,
            actionLink: {
              label: `View ${student.name}'s Report Card`,
              href: `/results?class=${encodeURIComponent(student.className)}&roll=${encodeURIComponent(student.rollNumber)}`,
            },
          });
        }
      } catch (e) {
        console.error("Direct roll lookup in chat error:", e);
      }

      return NextResponse.json({
        ok: true,
        reply: `To view the full report card for Roll Number ${detectedRoll}, please use our quick search bar: select your Class and enter Roll Number ${detectedRoll}.`,
        actionLink: {
          label: "Open Result Lookup",
          href: "/results",
        },
      });
    }

    // Check for greetings
    const lower = cleanMsg.toLowerCase();
    if (
      lower === "hi" ||
      lower === "hello" ||
      lower === "assalam o alaikum" ||
      lower === "salam" ||
      lower === "hey" ||
      lower.startsWith("hello") ||
      lower.startsWith("hi ")
    ) {
      return NextResponse.json({
        ok: true,
        reply: `Assalam-o-Alaikum! Welcome to Nayab English Grammer High School Mirwah. How can I assist you today?\n\nYou can ask me about:\n1. How to check exam results\n2. Fee submission and dues\n3. Daily school timings\n4. School uniform guidelines\n5. Upcoming holidays and announcements`,
      });
    }

    // Out-of-scope or unanswerable query: Polite refusal as required
    return NextResponse.json({
      ok: true,
      reply: `I am the virtual assistant for Nayab English Grammer High School Mirwah. I only have information regarding our school's admissions, exam results, fees, timings, uniform rules, and announcements.\n\nFor any other inquiries, please contact our administration office at ${SCHOOL_INFO.phone} or visit during official school hours.`,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "I am temporarily unable to process your request. Please check our FAQ or contact the school office.",
      },
      { status: 500 }
    );
  }
}
