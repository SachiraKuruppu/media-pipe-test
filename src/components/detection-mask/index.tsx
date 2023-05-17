import React, { useEffect, useState } from 'react';
import randomColor from 'randomcolor';

interface DetectionMaskProps {
    x: number,
    y: number,
    width: number,
    height: number,
    name: string,
    score: number
};

function DetectionMask({ x, y, width, height, name, score }: DetectionMaskProps) {
    const [backgroundColor, setBackgroundColor] = useState<string>('');

    useEffect(() => {
        const selectedColor = randomColor({ format: 'rgba', alpha: 0.5 });
        setBackgroundColor(selectedColor);
    }, []);

    return (
        <div
            className='col-xs-1 text-center'
            style={{
                left: x + 'px',
                top: y + 'px',
                width: width + 'px',
                height: height + 'px',
                position: 'absolute',
                backgroundColor: backgroundColor,
            }}
        >
            <p>{name}</p>
            <p>{score}</p>
        </div>
    );
}

export { DetectionMask };