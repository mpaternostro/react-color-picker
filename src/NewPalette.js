import React, { Component } from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import arrayMove from "array-move";
import {
  IconButton,
  Typography,
  Drawer,
  Divider,
  Button,
} from "@material-ui/core";
import { ChevronLeft as ChevronLeftIcon } from "@material-ui/icons";
import NewPaletteNav from "./NewPaletteNav";
import DraggableColorList from "./DraggableColorList";
import ColorPickerForm from "./ColorPickerForm";
import { PalettesContext } from "./contexts/PalettesContext";
import styles from "./styles/NewPaletteStyles";

export class NewPalette extends Component {
  static contextType = PalettesContext;
  static defaultProps = {
    maxColors: 20,
  };
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      currentPaletteColors: [
        { name: "red", color: "#FF0000" },
        { name: "blue", color: "#0048FF" },
        { name: "green", color: "green" },
        { name: "darkblue", color: "darkblue" },
        { name: "darkgreen", color: "darkgreen" },
        { name: "darkgray", color: "darkgray" },
        { name: "gray", color: "gray" },
        { name: "lightgray", color: "lightgray" },
      ],
      paletteNameErrorMessage: "",
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.addNewColor = this.addNewColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddPalette = this.handleAddPalette.bind(this);
    this.deleteColor = this.deleteColor.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.clearPalette = this.clearPalette.bind(this);
    this.addRandomColor = this.addRandomColor.bind(this);
  }

  toggleDrawer() {
    this.setState({ open: !this.state.open });
  }

  addNewColor(colorValue, colorName) {
    this.setState({
      currentPaletteColors: [
        ...this.state.currentPaletteColors,
        { name: colorName, color: colorValue },
      ],
    });
  }

  checkPaletteName(paletteName) {
    if (!paletteName) return "You must specify a Palette name.";

    if (
      this.context.palettes.some(
        (palette) =>
          palette.paletteName.toLowerCase() === paletteName.toLowerCase()
      )
    )
      return "Palette name must be unique.";
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
      paletteNameErrorMessage: "",
    });
  }

  handleAddPalette({ paletteName, emoji }) {
    const newPalette = {
      paletteName,
      emoji,
      id: paletteName.toLowerCase().replace(/ /g, "-"),
      colors: this.state.currentPaletteColors,
    };
    this.context.addPalette(newPalette);
    this.props.history.push("/");
  }

  deleteColor(colorName) {
    this.setState({
      currentPaletteColors: this.state.currentPaletteColors.filter(
        ({ name }) => name !== colorName
      ),
    });
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.setState((st) => ({
      currentPaletteColors: arrayMove(
        st.currentPaletteColors,
        oldIndex,
        newIndex
      ),
    }));
  }

  clearPalette() {
    this.setState({ currentPaletteColors: [] });
  }

  addRandomColor() {
    const allColors = this.context.palettes
      .map((palette) => palette.colors)
      .flat();
    const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
    this.setState({
      currentPaletteColors: [...this.state.currentPaletteColors, randomColor],
    });
  }

  render() {
    const { classes } = this.props;
    const {
      open,
      currentPaletteColors,
      paletteName,
      paletteNameErrorMessage,
    } = this.state;
    const isPaletteFull = currentPaletteColors.length === 20;

    return (
      <div>
        <NewPaletteNav
          toggleDrawer={this.toggleDrawer}
          open={open}
          handleChange={this.handleChange}
          paletteName={paletteName}
          paletteNameErrorMessage={paletteNameErrorMessage}
          handleAddPalette={this.handleAddPalette}
        />
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <div className={classes.container}>
            <Typography variant="h4" align="center" gutterBottom>
              Design your Palette
            </Typography>
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.clearPalette}
              >
                Clear Palette
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this.addRandomColor}
                disabled={isPaletteFull}
              >
                Random Color
              </Button>
            </div>
            <ColorPickerForm
              isPaletteFull={isPaletteFull}
              addNewColor={this.addNewColor}
              paletteColors={currentPaletteColors}
            />
          </div>
        </Drawer>
        <main
          className={clsx(classes.content, { [classes.contentShift]: !open })}
        >
          <div className={classes.drawerHeader} />
          <DraggableColorList
            items={currentPaletteColors}
            axis="xy"
            deleteColor={this.deleteColor}
            onSortEnd={this.onSortEnd}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(NewPalette);
