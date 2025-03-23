import React from "react";
import { useParams } from "react-router-dom";
import QuestionnaireForm from "../components/QuestionnaireForm";

const EditPage = () => {
  const { id } = useParams();
  return <QuestionnaireForm isEdit={true} id={id} />;
};

export default EditPage;
