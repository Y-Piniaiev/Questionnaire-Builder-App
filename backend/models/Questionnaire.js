const createQuestionnaire = (data) => {
  const { name, description, questions } = data;

  if (!name || !description || !Array.isArray(questions)) {
    throw new Error("Опитування повинно мати назву, опис та масив питань");
  }

  const questionsWithOrder = questions.map((question, index) => ({
    ...question,
    order: question.order || index + 1,
  }));

  questionsWithOrder.forEach((question) => {
    if (!question.questionType || !question.questionText) {
      throw new Error("Кожне питання повинно мати тип та текст");
    }

    if (
      !["text", "single_choice", "multiple_choice", "image"].includes(
        question.questionType
      )
    ) {
      throw new Error("Недійсний тип питання");
    }

    if (
      ["single_choice", "multiple_choice"].includes(question.questionType) &&
      (!Array.isArray(question.options) || question.options.length === 0)
    ) {
      throw new Error("Питання з вибором повинні мати варіанти відповідей");
    }
  });

  return {
    name,
    description,
    questions: questionsWithOrder,
    completions: 0,
    questionCount: questionsWithOrder.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const updateQuestionnaire = (existingData, newData) => {
  const { name, description, questions } = newData;

  if (!name || !description || !Array.isArray(questions)) {
    throw new Error("Опитування повинно мати назву, опис та масив питань");
  }

  const questionsWithOrder = questions.map((question, index) => ({
    ...question,
    order: question.order || index + 1,
  }));

  questionsWithOrder.forEach((question) => {
    if (!question.questionType || !question.questionText) {
      throw new Error("Кожне питання повинно мати тип та текст");
    }

    if (
      !["text", "single_choice", "multiple_choice", "image"].includes(
        question.questionType
      )
    ) {
      throw new Error("Недійсний тип питання");
    }

    if (
      ["single_choice", "multiple_choice"].includes(question.questionType) &&
      (!Array.isArray(question.options) || question.options.length === 0)
    ) {
      throw new Error("Питання з вибором повинні мати варіанти відповідей");
    }
  });

  return {
    ...existingData,
    name,
    description,
    questions: questionsWithOrder,
    questionCount: questionsWithOrder.length,
    updatedAt: new Date().toISOString(),
  };
};

const formatQuestionnaireDoc = (doc) => {
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  };
};

const formatQuestionnaireCollection = (snapshot) => {
  const questionnaires = [];
  snapshot.forEach((doc) => {
    questionnaires.push(formatQuestionnaireDoc(doc));
  });
  return questionnaires;
};

module.exports = {
  createQuestionnaire,
  updateQuestionnaire,
  formatQuestionnaireDoc,
  formatQuestionnaireCollection,
};
