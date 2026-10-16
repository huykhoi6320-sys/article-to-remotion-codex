import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';

export type Scene = {headline: string; body: string; durationSeconds: number; image?: string; kicker?: string};
export type VideoProps = {title: string; source: string; sourceUrl: string; scenes: Scene[]; voiceover?: string; music?: string};
const asset = (name: string) => /^(https?:\/\/)/i.test(name) ? name : staticFile(name.replace(/^\/?public\//, ''));
const sceneFrames = (seconds: number, fps: number) => Math.max(1, Math.round(seconds * fps));

const SceneCard: React.FC<{scene: Scene; ordinal: number; total: number; source: string}> = ({scene, ordinal, total, source}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = interpolate(frame, [0, Math.round(.45 * fps)], [40, 0], {extrapolateRight: 'clamp'});
  const opacity = interpolate(frame, [0, Math.round(.3 * fps)], [0, 1], {extrapolateRight: 'clamp'});
  const progress = Math.min(100, frame / Math.max(1, durationInFrames) * 100);
  return <AbsoluteFill style={{background: '#090f1d', color: '#fff', fontFamily: 'Arial, sans-serif', overflow:'hidden'}}>
    {scene.image ? <Img src={asset(scene.image)} style={{position:'absolute', width:'100%', height:'65%', objectFit:'cover', opacity:.6, transform:`scale(${1 + frame/(fps*200)})`}} /> : <AbsoluteFill style={{background:'radial-gradient(circle at 75% 28%,#284d70 0%,#101b34 44%,#090f1d 100%)'}}/>}
    <AbsoluteFill style={{background:'linear-gradient(0deg,#090f1d 17%,rgba(9,15,29,.94) 38%,rgba(9,15,29,.08) 100%)'}}/>
    <div style={{position:'absolute', top:90,left:72,right:72,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:31,fontWeight:700,color:'#e6c17b'}}>
      <span>NEWS EXPLAINED</span><span>{String(ordinal).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
    </div>
    <div style={{position:'absolute', bottom:270,left:74,right:74, opacity,transform:`translateY(${enter}px)`}}>
      <div style={{color:'#e6c17b',fontSize:30,fontWeight:800,letterSpacing:2,marginBottom:26}}>{scene.kicker || 'ĐIỂM TIN'}</div>
      <div style={{fontSize:76,lineHeight:1.12,fontWeight:900,letterSpacing:-1,overflowWrap:'anywhere',marginBottom:36}}>{scene.headline}</div>
      <div style={{fontSize:43,lineHeight:1.35,color:'#d8deea',overflowWrap:'anywhere'}}>{scene.body}</div>
    </div>
    <div style={{position:'absolute',bottom:116,left:74,right:74,fontSize:25,color:'#9ea9bd'}}>{source}</div>
    <div style={{position:'absolute',bottom:74,left:74,right:74,height:7,background:'#334055',borderRadius:20}}><div style={{width:`${progress}%`,height:'100%',background:'#e6c17b',borderRadius:20}}/></div>
  </AbsoluteFill>;
};

export const NewsVideo: React.FC<VideoProps> = ({scenes, source, voiceover, music}) => {
  const {fps} = useVideoConfig();
  let cursor=0;
  return <AbsoluteFill>
    {scenes.map((scene,i)=>{ const start=cursor; const durationInFrames=sceneFrames(scene.durationSeconds,fps); cursor+=durationInFrames; return <Sequence key={i} from={start} durationInFrames={durationInFrames}><SceneCard scene={scene} ordinal={i+1} total={scenes.length} source={source}/></Sequence>; })}
    {music && <Audio src={asset(music)} volume={.12}/>}
    {voiceover && <Audio src={asset(voiceover)} volume={1}/>}
  </AbsoluteFill>;
};
