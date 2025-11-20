const getCollectionCode = (cl: string) => {
  if (cl === 'CL0') {
    return 'Classic';
  } else if (cl === 'CL1') {
    return 'Vibe';
  } else if (cl === 'CL2') {
    return 'Junior';
  } else return 'Active';
};

export default getCollectionCode;
