"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "/Components/Loading/LoadingPage.module.css"; 
import Navbar from "../NavBar/NavBar";
import StickySide from "../StickySide/StickySide";
const LoadingPage = () => {
  const router = useRouter(); 

  return (
    <div  className={styles.body}>
      <div className={styles.pageContainer}>
              <Navbar/>
            <div className={styles.mainContent}>
              <StickySide />
      <div className={styles.mainCont}>
        <div className={styles.processing}>
          <div className={styles.text}>
            <h3>Processing</h3>
            <p>This Can Take Several Minutes</p>
          </div>
          <div className={styles.dots}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
          <button onClick={() => router.push("/main")} className={styles.cancelButton}>
            Cancel
          </button>
        </div>

        {/* <div className={styles.readyText}>
          <p>While We Get Things Ready For You,</p>
          <p>Check Out These Amazing Software's To Boost Your Productivity!</p>
        </div> */}

        <div className={styles.sponsors}>
          <div className={styles.admultiplier}>
            <div className={styles.adText}>
              <div className={styles.headings}>
                <h2>AdMultiplier.io</h2>
                <p>Generate 100+ ad variations in minutes—no manual edits, no delays</p>
              </div>
              <ul className={styles.unorderedLists}>
                <li>Upload your hooks, leads, and body —AI mixes & matches them</li>
                <li>Eliminate manual edits & creative bottlenecks</li>
                <li>Test and optimize ads at an unprecedented speed</li>
              </ul>
            </div>
            <a
              href="https://admultiplier.io/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.learnBtn}
            >
              Learn More
            </a>
          </div>

          <div className={styles.crafter}>
            <div className={styles.adText}>
              <div className={styles.headings}>
                <h2>VideoCrafter.io</h2>
                <p>
                  Create high-quality video ads in minutes — Just upload your script, highlight words from the
                  script, and assign clips. Our AI does the rest.
                </p>
              </div>
              <ul className={styles.unorderedLists}>
                <li>Auto-generates voice-over, subtitles & perfect timing</li>
                <li>Smart word highlighting for seamless storytelling</li>
                <li>No manual trimming—clips sync instantly</li>
                <li>Turn ideas into polished video ads effortlessly</li>
              </ul>
            </div>
            <a
              href="https://videocrafter.io/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.learnBtn}
            >
              Learn More
            </a>
          </div>

          <div className={styles.hooksmaster}>
            <div className={styles.adText}>
              <div className={styles.headings}>
                <h2>HooksMaster.io</h2>
                <p>
                  Create video hooks in minutes — Simply input your hooks, choose clips, and let AI handle the
                  rest.
                </p>
              </div>
              <ul className={styles.unorderedLists}>
                <li>Upload your hooks texts via Google Sheets—AI auto-generates variations</li>
                <li>Select video clips & AI voiceovers effortlessly</li>
                <li>Customize fonts, colors & hook styles to match your brand</li>
                <li>Merge hooks seamlessly into your creatives for instant ad testing</li>
              </ul>
            </div>
            <a
              href="https://hooksmaster.io/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.learnBtn}
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>

  );
};

export default LoadingPage;