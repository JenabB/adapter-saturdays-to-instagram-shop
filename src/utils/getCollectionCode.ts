const getCollectionCode = (cl: string) => {
  const collectionMap: { [key: string]: string } = {
    CL0: 'Classic',
    CL1: 'Vibe',
    CL2: 'Junior',
    CL3: 'Active',
    CL4: 'Blitz',
  };

  return collectionMap[cl] || 'Unknown';
};

export default getCollectionCode;
