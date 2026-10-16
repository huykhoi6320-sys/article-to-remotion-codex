import React from 'react';
import {Composition} from 'remotion';
import {NewsVideo, VideoProps} from './video';
import demo from '../examples/demo.json';

export const Root: React.FC = () => (
  <Composition
    id="NewsVideo"
    component={NewsVideo}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={1800}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(30, Math.round(props.scenes.reduce((n, s) => n + s.durationSeconds, 0) * 30))})}
    defaultProps={demo as VideoProps}
  />
);
