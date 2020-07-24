import React, { Component } from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import styles from "./styles/ColorBoxStyles";

export class ColorBox extends Component {
  constructor(props) {
    super(props);

    this.handleCopy = this.handleCopy.bind(this);
    this.handleLink = this.handleLink.bind(this);
  }

  handleCopy() {
    this.props.setCopied(this.props.backgroundColor);
  }

  handleLink(evt) {
    evt.stopPropagation();
  }

  render() {
    const { backgroundColor, name, moreUrl, classes } = this.props;

    return (
      <CopyToClipboard text={backgroundColor} onCopy={this.handleCopy}>
        <div className={classes.ColorBox}>
          <div className={classes.colorName}>
            <p>{name}</p>
          </div>
          <div className={classes.copyColor}>
            <p>Copy</p>
          </div>
          {moreUrl && (
            <div className={classes.moreColors}>
              <Link to={moreUrl} onClick={this.handleLink}>
                <p>More</p>
              </Link>
            </div>
          )}
        </div>
      </CopyToClipboard>
    );
  }
}

export default withStyles(styles)(ColorBox);
