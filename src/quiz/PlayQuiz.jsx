import { Button } from "@mui/material";
import "./quiz.css";
import { useEffect, useState } from "react";
import axios from "axios";

function PlayQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [userAnswer, setUserAnswer] = useState(new Map());
  const [result, setResult] = useState(0);
  const [isFinishQuiz, setIsFinishQuiz] = useState(false);

  useEffect(() => {
    getQuizData();
  }, [true]);

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const getQuizData = () => {
    axios
      .get("https://opentdb.com/api.php?amount=10")
      .then(function (response) {
        // handle success
        const data = [];
        response.data["results"].forEach((item, index) => {
          let answers = item.incorrect_answers;
          answers.push(item.correct_answer);
          item.answers = shuffle(answers);
          item.id = `que_${index}`;
          data.push(item);
        });
        setQuizzes(data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  };

  const onCalculateResult = () => {
    let result = 0;
    quizzes.forEach((que) => {
      if (userAnswer.get(que.id) === que.correct_answer) {
        result = result + 1;
      }
    });
    setResult(result);
    setIsFinishQuiz(true);
  };

  return (
    <>
      <div className="main-container">
        <div className="left-sidebar">Left Sidebar</div>
        <div className="quiz-container">
          {isFinishQuiz ? (
            <div>
              <div className="score-container">
                <span>
                  <h2 className="score-title">Your Score</h2>
                </span>
                <span className="score">{result}</span>
              </div>
            </div>
          ) : (
            <div>
              {quizzes.map((quiz) => (
                <div className="quiz-title-container">
                  <h2>{quiz.question}</h2>
                  {/* <h5 className="sub-text">Question 1 of 10</h5> */}
                  <div>
                    {quiz.answers.map((answer) => (
                      <div className="quiz-answer-container">
                        <Button
                          variant="contained"
                          className={
                            userAnswer.get(quiz.id) === answer
                              ? "answer-option-correct"
                              : "answer-option"
                          }
                          onClick={() => {
                            userAnswer.set(quiz.id, answer);
                            setUserAnswer(new Map(userAnswer));
                          }}
                        >
                          <span className="answer">
                            {/* <p className="answer-option">{answer}</p> */}
                            <span>{answer}</span>
                          </span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                className="next-button"
                variant="contained"
                onClick={onCalculateResult}
              >
                Next
              </Button>
            </div>
          )}
        </div>
        <div className="right-sidebar">Right Sidebar</div>
      </div>
    </>
  );
}

export default PlayQuiz;
