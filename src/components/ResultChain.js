import React from "react";
import { Grid } from "@material-ui/core";

const ResultChain = (props) => {
  return (
    <>
      <Grid item xs={6}>
        <p>TOM</p>
      </Grid>
      <Grid item xs={6}>
        <p>YOU</p>
      </Grid>
      {JSON.parse(sessionStorage.getItem("usedWords")) ? (
        JSON.parse(sessionStorage.getItem("usedWords")).map((item, index) => {
          return (
            <>
              {index % 2 === 0 && (
                <Grid item xs={6}>
                  <ul>
                    <li>{item}</li>
                  </ul>
                </Grid>
              )}
              {index % 2 === 1 && (
                <Grid style={{ position: "relative", top: 30 }} item xs={6}>
                  <ul>
                    <li>{item} </li>
                  </ul>
                </Grid>
              )}
            </>
          );
        })
      ) : (
        <Grid item xs={6}>
          <ul>
            <li>{props.selectedWord}</li>
          </ul>
        </Grid>
      )}
    </>
  );
};

export default ResultChain;
