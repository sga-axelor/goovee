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
  nbResponses?: number;
};

export type Response = {
  id: number;
  attrs: {
    title: string;
    statusSelect: number;
    surveyConfig: {
      name: string;
      statusSelect: number;
      category: {
        name: string;
      };
      publicationDatetime: string;
    };
    partner: {
      name: string;
      fullName: string;
    };
  };
  updatedOn?: string;
  createdOn: string;
};
