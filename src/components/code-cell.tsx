import Preview from './preview';
import CodeEditor from './code-editor';
import bundle from '../bundler';
import { useState } from 'react';
import Resizable from './resizable';

const CodeCell = () => {
    const [text, setText] = useState(``);
    const [bundledCode, setBundledCode] = useState('');

    const handleSubmit = async () => {
        const output = await bundle(text);
        setBundledCode(output);
    };

    return (
        <Resizable direction='vertical'>
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                <Resizable direction='horizontal'>
                    <CodeEditor
                        initialValue={'console.log(123);'}
                        onChange={(value: string) => setText(value)}
                    />
                </Resizable>

                <Preview code={bundledCode} />
            </div>
        </Resizable>
    );
};

export default CodeCell;
