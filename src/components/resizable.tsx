import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizable.css';

interface ResizableProps {
    direction: 'vertical' | 'horizontal';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
    let resizeableProps: ResizableBoxProps;

    if (direction === 'vertical') {
        resizeableProps = {
            width: Infinity,
            height: 300,
            maxConstraints: [Infinity, window.innerHeight * 0.9],
            minConstraints: [Infinity, 75],
            resizeHandles: ['s'],
        };
    } else {
        resizeableProps = {
            width: window.innerWidth * 0.5,
            height: Infinity,
            maxConstraints: [window.innerWidth * 0.9, Infinity],
            minConstraints: [100, Infinity],
            resizeHandles: ['e'],
            className: 'resize-horizontal',
        };
    }

    return <ResizableBox {...resizeableProps}>{children}</ResizableBox>;
};

export default Resizable;
