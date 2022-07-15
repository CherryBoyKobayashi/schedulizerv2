import './colorPicker.css'
import React from "react";
import { SketchPicker } from "react-color";

class ColorPicker extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open: false,
            color: props.color
        }
    }
    handleChange = color => {
        this.setState({color: color.hex})
    }
    handleOpenClose = () => {
        this.setState({open: !this.state.open})
    }
    handleGet = () => {
        return this.state.color
    }
    render = () => {
        return (
            <>
            {sessionStorage.setItem("milestoneColor", (this.state.color))}
                <div className="colorPickLeftDiv">
                    <div className="colorBar">
                        <div className="colorBarLeft" onClick={this.handleOpenClose}>カラー選択</div>
                        <div className="colorBarRight" style={{background: this.state.color}}></div>
                    </div>
                </div>
                {this.state.open && (
                    <div className="pickerDiv">
                        <div className="pickerBack" onClick={this.handleOpenClose}></div>
                        <SketchPicker color={this.state.color}onChange={this.handleChange}/>
                    </div>
                )}
            </>
        )
    }
}

export default ColorPicker