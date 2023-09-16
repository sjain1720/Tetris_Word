import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default class GameOver extends Component {

    render() {

        return (
            <div className={css(styles.container)}>
                <h2>Game Over</h2>
                <h3>{`You scored ${this.props.score}`}</h3>
            </div>
        );
    }
}




