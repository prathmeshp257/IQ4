import React, { useState } from "react"
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "../../components/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        minHeight: 200,
        maxHeight: 400,
        overFlowY: "scroll",
    },
    dialogPaper: {
        maxHeight: "75vh",
    },
});

const CropImage = (prop) => {
    const { cropOpen, setCropOpen, image, setImage } = prop;
    const [cropper, setCropper] = useState("");

    const handleCropClose = () => {
        setCropper("");
        setCropOpen(false);
    }

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setImage(cropper.getCroppedCanvas().toDataURL().toString().split("base64,").pop());
            handleCropClose()
        }
    };

    const classes = useStyles();

    return (
        <Dialog
            open={cropOpen}
            onClose={() => {
                setCropOpen(false);
                setImage('')
            }}
            fullWidth={true}
            classes={{ paper: classes.dialogPaper }}
            maxWidth={"md"}
        >
            <DialogTitle style={{ marginBottom: 10, paddingBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                    <h5 style={{fontSize:'24px'}}>Resize Image</h5>
                    {/* <button
                        type="button"
                     
                        
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    > */}
                        <span    onClick={() => {
                            setCropOpen(!cropOpen);
                            setImage('')
                        }}
                        style={{fontSize:'35px',cursor:'pointer'}}>&times;</span>
                    {/* </button> */}
                </div>
            </DialogTitle>
            <DialogContent>

                <div style={{ marginBottom:'10px'}} >
                    <Cropper
                        style={{width: "100%" }}
                        zoomTo={0}
                        aspectRatio={0}
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        onInitialized={(instance) => {
                            setCropper(instance);
                        }}
                        guides={true}
                    />
                </div>
                <Button text="Crop" onClick={getCropData} buttonStyle={{ float: 'right' }} type="button">
                    Crop Image
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default CropImage

