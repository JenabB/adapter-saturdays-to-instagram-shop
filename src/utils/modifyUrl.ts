const modifyURL = (url: string) => url?.replace(/\s+/g, '-').toLowerCase();

export default modifyURL;
