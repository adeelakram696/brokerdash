import {
  DOC, DOCX, GIF, JPG, ODP, PDF, PNG, PPT, PPTX, TXT, XLS, XLSX,
} from 'app/images/icons/files';

const FileIcon = ({
  extension, width = '21', height = '26', color,
}) => {
  const icons = {
    doc: <DOC color={color} width={width} height={height} />,
    docx: <DOCX color={color} width={width} height={height} />,
    gif: <GIF color={color} width={width} height={height} />,
    jpg: <JPG color={color} width={width} height={height} />,
    odp: <ODP color={color} width={width} height={height} />,
    pdf: <PDF color={color} width={width} height={height} />,
    png: <PNG color={color} width={width} height={height} />,
    ppt: <PPT color={color} width={width} height={height} />,
    pptx: <PPTX color={color} width={width} height={height} />,
    txt: <TXT color={color} width={width} height={height} />,
    xls: <XLS color={color} width={width} height={height} />,
    xlsx: <XLSX color={color} width={width} height={height} />,
  };
  return icons[extension] || icons.txt;
};

export default FileIcon;
