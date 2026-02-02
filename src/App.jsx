import React, { useState, useCallback } from "react";
import LessonRoom from "./components/LessonRoom";
import ClassroomSplitTwoD from "./components/ClassroomSplitTwoD";

/* ====== Import Lessons ====== */
/* ✅ چهار درس اصلی */
import flow from "./lessons/flow";
import telecom from "./lessons/telecom";
import radiolinks from "./lessons/radiolinks";
import modems from "./lessons/modems";
import mobilesite from "./lessons/mobilesite";

/* ✅ بقیه دروس */
import troubleshooting from "./lessons/troubleshooting";
import RRU from "./lessons/RRU";
import power from "./lessons/power";
import safety from "./lessons/safety";
import Rack from "./lessons/Rack";
import fiber from "./lessons/fiber";
import Sector from "./lessons/Sector";
import radio from "./lessons/radio";
import field from "./lessons/field";

/* ====== Normalizer ====== */
function normalizeLesson(raw, name) {
  if (!Array.isArray(raw)) return raw;

  return {
    title: name,
    color:
      /* ✅ چهار درس اصلی */
      name === "جریان داده" ? "#457b9d" :
      name === "تلکام" ? "#e63946" :
      name === "لینک‌های رادیویی" ? "#7b2cbf" :
      name === "مودم‌" ? "#118ab2" :
      name === "سایت موبایل" ? "#ef476f" :

      /* ✅ سایر دروس */
      name === "عیب‌یابی" ? "#2a9d8f" :
      name === "RRU" ? "#f4a261" :
      name === "برق" ? "#fcca46" :
      name === "ایمنی و HSE" ? "#d90429" :
      name === "Rack" ? "#06d6a0" :
      name === "فیبر نوری" ? "#8338ec" :
      name === "سکتور" ? "#ff9f1c" :
      name === "رادیو" ? "#8d6e63" :
      name === "تجربه میدانی" ? "#4d908e" :
      "#ffffff",

    chapters: raw.map((c, i) => ({
      id: "ch_" + i,
      title: c.section || "بدون عنوان",
      topics: (c.topics || []).map((t, j) => ({
        id: `t_${i}_${j}`,
        title: t.title,
        content: t.content,
        subtopics: t.subtopics || [],
      })),
    })),
  };
}

/* ====== Lessons List (Order Matters) ====== */
const LESSONS = {
  /* ✅ اولویت‌دار */
  flow: normalizeLesson(flow, "جریان داده"),
  telecom: normalizeLesson(telecom, "تلکام"),
  radiolinks: normalizeLesson(radiolinks, "لینک‌های رادیویی"),
  modems: normalizeLesson(modems, "مودم‌"),
  mobilesite: normalizeLesson(mobilesite, "سایت موبایل"),

  /* ✅ ادامه مسیر */
  troubleshooting: normalizeLesson(troubleshooting, "عیب‌یابی"),
  RRU: normalizeLesson(RRU, "RRU"),
  power: normalizeLesson(power, "برق"),
  safety: normalizeLesson(safety, "ایمنی و HSE"),
  Rack: normalizeLesson(Rack, "Rack"),
  fiber: normalizeLesson(fiber, "فیبر نوری"),
  Sector: normalizeLesson(Sector, "سکتور"),
  radio: normalizeLesson(radio, "رادیو"),
  field: normalizeLesson(field, "تجربه میدانی"),
};

/* ====== Styles ====== */
function getStyles() {
  return {
    container: {
      width: "100vw",
      height: "100vh",
      backgroundColor: "#0f172a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "20px",
      color: "white",
      direction: "rtl",
      fontFamily: "sans-serif",
      overflow: "hidden",
    },
    header: {
      fontSize: "2.2rem",
      marginBottom: "6px",
      background: "linear-gradient(to right, #4eaaff, #a355ff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subHeader: {
      fontSize: "1rem",
      marginBottom: "12px",
      color: "#b6c0d1",
    },
    scrollArea: {
      width: "100%",
      height: "calc(100vh - 120px)",
      overflowY: "auto",
      padding: "0 20px 40px",
      boxSizing: "border-box",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "22px",
      justifyItems: "center",
    },
    card: {
      width: "140px",
      height: "160px",
      background: "rgba(30, 41, 59, 0.9)",
      borderRadius: "14px",
      border: "2px solid #334155",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      position: "relative",
    },
    icon: {
      width: "46px",
      height: "46px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    },
    cardTitle: {
      marginTop: "10px",
      fontSize: "0.9rem",
      textAlign: "center",
    },
    twoDButton: {
      position: "absolute",
      bottom: 0,
      left: 0,
      padding: "4px 10px",
      border: "2px solid #4e5d7e",
      borderRadius: "0 0 0 11px",
      fontSize: "0.75rem",
      cursor: "pointer",
      background: "rgba(30,41,59,.9)",
    },
  };
}

/* ====== Lesson Card ====== */
const LessonCard = ({ lesson, onSelect3D, onSelect2D }) => {
  const styles = getStyles();
  return (
    <div
      style={{ ...styles.card, borderColor: lesson.color }}
      onClick={() => onSelect3D(lesson)}
    >
      <div style={{ ...styles.icon, background: lesson.color }}>
        {lesson.title.substring(0, 2)}
      </div>
      <div style={styles.cardTitle}>{lesson.title}</div>

      <button
        style={styles.twoDButton}
        onClick={(e) => {
          e.stopPropagation();
          onSelect2D(lesson);
        }}
      >
        2D
      </button>
    </div>
  );
};

/* ====== App ====== */
export default function App() {
  const [activeLesson, setActiveLesson] = useState(null);
  const [viewMode, setViewMode] = useState(null);

  const handleBack = useCallback(() => {
    setActiveLesson(null);
    setViewMode(null);
  }, []);

  const handleSelect3D = useCallback((lesson) => {
    setActiveLesson(lesson);
    setViewMode("3D");
  }, []);

  const handleSelect2D = useCallback((lesson) => {
    setActiveLesson(lesson);
    setViewMode("2D");
  }, []);

  if (activeLesson && viewMode === "3D") {
    return (
      <LessonRoom
        lesson={activeLesson}
        onBack={handleBack}
        on2D={() => handleSelect2D(activeLesson)}
      />
    );
  }

  if (activeLesson && viewMode === "2D") {
    return (
      <ClassroomSplitTwoD
        lesson={activeLesson}
        onBack={handleBack}
        onSwitchTo3D={() => handleSelect3D(activeLesson)}
      />
    );
  }

  return (
    <div style={getStyles().container}>
      <h1 style={getStyles().header}>دانشگاه متاورس</h1>
      <p style={getStyles().subHeader}>
        روی کارت کلیک کنید (۳D) یا دکمه 2D را بزنید
      </p>

      <div style={getStyles().scrollArea}>
        <div style={getStyles().grid}>
          {Object.keys(LESSONS).map((key) => (
            <LessonCard
              key={key}
              lesson={LESSONS[key]}
              onSelect3D={handleSelect3D}
              onSelect2D={handleSelect2D}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
