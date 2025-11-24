import React, { useRef, useState, useEffect, useContext } from "react";
import ai from "../assets/sute-mouse-dj-disco-dancing-generative-ai-scaled.webp";
import { ShopDataContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import openingSoundFile from "../assets/cat-meowing-ai-generated-261841.mp3";

function Ai() {
  const { showSearch, setShowSearch } = useContext(ShopDataContext);
  const navigate = useNavigate();
  const [activeAi, setActiveAi] = useState(false);

  const openingSound = useRef(new Audio(openingSoundFile)).current;

  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  function speak(message) {
    const utter = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utter);
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      console.log("Heard:", transcript);

      if (transcript.includes("search") && transcript.includes("open")) {
        if (!showSearch) {
          speak("opening search");
          setShowSearch(true);
          navigate("/collection");
        }
      } else if (transcript.includes("close") && showSearch) {
        speak("closing search");
        setShowSearch(false);
      } else if (
        transcript.includes("collection") ||
        transcript.includes("collections") ||
        transcript.includes("product") ||
        transcript.includes("products")
      ) {
        speak("opening collection page");
        navigate("/collection");
        setShowSearch(false);
      } else if (transcript.includes("about")) {
        speak("opening about page");
        navigate("/about");
        setShowSearch(false);
      } else if (transcript.includes("home")) {
        speak("opening home page");
        navigate("/");
        setShowSearch(false);
      } else if (transcript.includes("cart")) {
        speak("opening cart page");
        navigate("/cart");
        setShowSearch(false);
      } else if (transcript.includes("contact")) {
        speak("opening contact page");
        navigate("/contact");
        setShowSearch(false);
      } else if (
        transcript.includes("order") ||
        transcript.includes("orders") ||
        transcript.includes("my order")
      ) {
        speak("opening orders page");
        navigate("/order");
        setShowSearch(false);
      } else {
        toast.error("Command not found");
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveAi(false); // stop animation
    };

    recognitionRef.current = recognition;
  }, [showSearch, navigate, setShowSearch]);

  const startListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) return;

    try {
      openingSound.play();
      setActiveAi(true); // start animation
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.log("Start error:", err);
    }
  };

  return (
    <div
      className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%]"
      onClick={startListening}
    >
      <img
        src={ai}
        alt=""
        className={`w-[100px] cursor-pointer ${
          activeAi ? "translate-x-[10%] scale-125" : "translate-x-0 scale-100"
        } transition-transform`}
        style={{
          filter: activeAi
            ? "drop-shadow(0px 0px 30px #00d2fc)"
            : "drop-shadow(0px 0px 20px black)",
        }}
      />
    </div>
  );
}

export default Ai;
