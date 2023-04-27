import React, {useRef, useState} from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import {FileObject} from '@aemforms/af-core';
import {getFileSizeInBytes} from '@aemforms/af-core';
import '../../dist/theme.css';
import { IHandler } from '../utils/type';
import withRuleEngine from '../utils/HOC';

const FileUpload = (props: State<FieldJson> & IHandler) => {
   const fileInputField = useRef(null);
   const { id, name, value, label, valid, errorMessage, required, description, accept, maxFileSize } = props;
   let val = value && ((value instanceof Array) ? value : [value]);
   const [files, setFiles] = useState<FileObject[]>(val || []);
   const validateState = valid === false ? 'invalid' : 'valid';
   const error = validateState === 'invalid';
   const maxFileSizeInBytes = getFileSizeInBytes(maxFileSize);
   let newMultiple = props.type?.endsWith('[]') ? { multiple: true } : {};

   const callUpdateFilesCb = (files : Array<File|FileObject>) => {
    if (newMultiple) {
      props.dispatchChange(files);
    } else {
      props.dispatchChange(files.length > 0 ? files[0] : null);
    }
};

   const fileListToArray = (newFiles: FileList) => {
    let localFiles = [];
    //@ts-ignore
    for (const file of newFiles) {
        if (file.size <= maxFileSizeInBytes) {
            localFiles.push(file);
        }
    }
    return localFiles;
};

   const handleNewFileUpload = (e: { target: { files: FileList | null; }; }) => {
    const { files: newFiles } = e.target;
    if (newFiles?.length) {
        const updatedFiles = files.concat(fileListToArray(newFiles));
        console.log('update-new', updatedFiles);
        setFiles(updatedFiles);
        callUpdateFilesCb(updatedFiles);
    }
};

  const removeFile = (index: number) => {
    const updatedFiles = files.slice(0, index).concat(files.slice(index + 1));
    setFiles(updatedFiles);
    callUpdateFilesCb(updatedFiles);
};

   return (
     <div className="cmp-adaptiveform-fileinput">
       {label?.visible && <label id={`${id}-label`} htmlFor={id} className="cmp-adaptiveform-fileinput__label">{label?.value}</label>}
       <br/>
       <label htmlFor={`${id}_widget`} className="cmp-adaptiveform-fileinput__widgetlabel">Attach</label>
       <input  ref={fileInputField} className="cmp-adaptiveform-fileinput__widget" id={`${id}_widget`} type='file' name={name} onChange={handleNewFileUpload} required={required} accept={accept?.toString()} multiple max-file-size={maxFileSize} style={{display: 'none'}}/>
       <ul className="cmp-adaptiveform-fileinput__filelist">
           {files && files?.map((item: FileObject, index) => {
          // // @ts-ignore
          return (
             <li className="cmp-adaptiveform-fileinput__fileitem" key={item?.name}>
                <span className="cmp-adaptiveform-fileinput__filename">{item?.name}</span>
                <span onClick={() => removeFile(index)} className="cmp-adaptiveform-fileinput__filedelete" aria-label={`Press Enter to delete the ${item?.name}`} role="button">x</span>
            </li>
          );
           })}
       </ul>
       {error && <div  id={`${id}-errorMessage`} className="cmp-adaptiveform-fileinput__errormessage">{errorMessage}</div>}
       {description && !error && <div className="cmp-adaptiveform-fileinput__longdescription" id={`${id}-longDescription`}>{description}</div>}
     </div>
   );  
};

export default withRuleEngine(FileUpload);