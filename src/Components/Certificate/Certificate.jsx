
import React from "react";
import { useState } from "react";
import TemplateSelection from "./TemplateSelection";
import CertificateEditor from "./CertificateEditor";

// Main App Component
const Certificate = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  return (
    <>
      {!selectedTemplate ? (
        <TemplateSelection onSelectTemplate={handleSelectTemplate} />
      ) : (
        <CertificateEditor template={selectedTemplate} onBack={handleBack} />
      )}
    </>
  );
};

export default Certificate;