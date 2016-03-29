import React, {Component} from 'react';

export default class TextTruncate extends Component {
    static propTypes = {
        text: React.PropTypes.string,
        truncateText: React.PropTypes.string,
        line: React.PropTypes.number,
        showTitle: React.PropTypes.bool,
        title: React.PropTypes.string
    };

    static defaultProps = {
        text: '',
        truncateText: '…',
        line: 1,
        showTitle: true
    };

    constructor() {
        super();
        this.onResize = this.onResize.bind(this);
    }
    componentWillMount() {
        let canvas = document.createElement('canvas');
        let docFragment = document.createDocumentFragment();
        docFragment.appendChild(canvas);
        this.canvas = canvas.getContext('2d');
    }
    componentDidMount() {
        let style = window.getComputedStyle(this.refs.scope);
        let font = [];
        font.push(style['font-weight']);
        font.push(style['font-style']);
        font.push(style['font-size']);
        font.push(style['font-family']);
        this.canvas.font = font.join(' ');
        this.forceUpdate();
        window.addEventListener('resize', this.onResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }
    onResize() {
        this.forceUpdate();
    }
    measureWidth(text) {
        return this.canvas.measureText(text).width;
    }
    getRenderText() {
        let textWidth = this.measureWidth(this.props.text);
        let ellipsisWidth = this.measureWidth(this.props.truncateText);
        let scopeWidth = this.refs.scope.offsetWidth;

        if (scopeWidth >= textWidth) {
            return this.props.text;
        } else {
            let n = 0;
            let max = this.props.text.length;
            let text = '';
            let splitPos = 0;
            let startPos = 0;
            let line = this.props.line;
            while(line--) {
                let ext = line ? '' : this.props.truncateText;
                while(n <= max) {
                    n++;
                    text = this.props.text.substr(startPos, n);
                    if (this.measureWidth(text + ext) > scopeWidth) {
                        splitPos = text.lastIndexOf(' ');
                        if (splitPos === -1) {
                            splitPos = n - 1;
                        }
                        startPos += splitPos;
                        break;
                    }
                }
                if (n >= max) {
                    startPos = max;
                    break;
                }
                n = 0;
            }
            return startPos === max
                      ? this.props.text
                      : this.props.text.substr(0, startPos - 1) + this.props.truncateText;
        }
    }
    render() {
        let text = '';
        if (this.refs.scope) {
            text = this.getRenderText();
        }
        let attrs = {
            ref: 'scope'
        };
        if (this.props.showTitle) {
            attrs.title = this.props.title;
        }

        return (
            <div {...attrs}>{text}</div>
        );
    }
};
