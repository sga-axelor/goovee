export type Survey = {
  id: number;
  name: string;
  statusSelect: number;
  typeSelect: number;
  category: {
    name: string;
  };
  target: string;
  publicationDatetime: string;
  customModel: string;
};

export type Response = {
  id: number;
  attrs: {
    title: string;
    statusSelect: number;
    surveyConfig: {
      name: string;
    };
    partner: {
      name: string;
      fullName: string;
    };
  };
};
