const createResponse = (data) => {
  const { questionnaireId, answers, startedAt, completedAt } = data;

  if (
    !questionnaireId ||
    !Array.isArray(answers) ||
    !startedAt ||
    !completedAt
  ) {
    throw new Error(
      "Відповідь повинна мати ID опитування, масив відповідей, час початку та час завершення"
    );
  }

  answers.forEach((answer) => {
    if (!answer.questionText || !answer.questionType) {
      throw new Error(
        "Кожна відповідь повинна мати текст питання та тип питання"
      );
    }

    if (answer.questionType === "text" && typeof answer.answer !== "string") {
      throw new Error("Відповідь на текстове питання повинна бути рядком");
    }

    if (
      answer.questionType === "single_choice" &&
      typeof answer.answer !== "string"
    ) {
      throw new Error(
        "Відповідь на питання з одиночним вибором повинна бути рядком"
      );
    }

    if (
      answer.questionType === "multiple_choice" &&
      !Array.isArray(answer.answer)
    ) {
      throw new Error(
        "Відповідь на питання з множинним вибором повинна бути масивом"
      );
    }

    if (answer.questionType === "image" && typeof answer.answer !== "string") {
      throw new Error("Відповідь на питання з зображенням повинна бути URL");
    }
  });

  const startDate = new Date(startedAt);
  const endDate = new Date(completedAt);
  const completionTime = endDate.getTime() - startDate.getTime();

  return {
    questionnaireId,
    answers,
    completionTime,
    startedAt,
    completedAt,
    createdAt: new Date().toISOString(),
  };
};

const formatResponseDoc = (doc) => {
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  };
};

const formatResponseCollection = (snapshot) => {
  const responses = [];
  snapshot.forEach((doc) => {
    responses.push(formatResponseDoc(doc));
  });
  return responses;
};

module.exports = {
  createResponse,
  formatResponseDoc,
  formatResponseCollection,
};
