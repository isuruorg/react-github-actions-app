export default function useDownload() {
  const download = (fileName = 'TraceClaw-File', format = 'csv', content = []) => {
    const url = window.URL.createObjectURL(new Blob([content]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.${format}`); // or any other extension
    document.body.appendChild(link);
    link.click();
  };

  return download;
}
