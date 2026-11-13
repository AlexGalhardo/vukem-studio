"""Original, locally synthesized 120 BPM instrumental; no external samples."""
import json, numpy as np, wave, pathlib
scenes=json.loads(pathlib.Path('scripts/film/scenes.json').read_text())
rate=48000
duration=sum(float(scene['seconds']) if scene.get('seconds') else 8 for scene in scenes)
boundaries=[]
cursor=0.0
for scene in scenes:
    seconds=float(scene['seconds']) if scene.get('seconds') else 8
    cursor+=seconds
    if cursor<duration: boundaries.append(cursor)
t=np.arange(int(rate*duration),dtype=np.float64)/rate
a=np.zeros(len(t));rng=np.random.default_rng(43)
# A minor, F, C, G: slow pads with rising rhythmic density.
chords=[(220,261.63,329.63),(174.61,220,261.63),(130.81,164.81,196),(196,246.94,293.66)]
for bar in range(int(np.ceil(duration / 2))):
 start=bar*2; mask=(t>=start)&(t<start+2);q=t[mask]-start; notes=chords[(bar//2)%4]
 env=np.minimum(q*4,1)*np.minimum((2-q)*4,1)
 a[mask]+=sum(.055*np.sin(2*np.pi*f*q)+.015*np.sin(2*np.pi*f*2*q) for f in notes)*env
for beat in np.arange(8,max(8,duration-4),.5):
 j=int(beat*rate);n=min(int(.4*rate),len(a)-j);q=np.arange(n)/rate
 a[j:j+n]+=.29*np.sin(2*np.pi*(48*q+45*(1-np.exp(-q*24))/24))*np.exp(-q*13)
 if beat>=24:
  n=int(.09*rate);q=np.arange(n)/rate;a[j:j+n]+=.035*rng.normal(size=n)*np.exp(-q*65)
for b in np.arange(16,max(16,duration-4),.25):
 j=int(b*rate);n=int(.23*rate);q=np.arange(n)/rate;f=chords[int(b//4)%4][int(b*4)%3]*2
 a[j:j+n]+=.065*np.sin(2*np.pi*f*q)*np.exp(-q*17)*np.minimum(q*150,1)
# Scene-synchronized restrained impact and bright ticks.
for b in boundaries:
 j=int(round(b * rate)); n=min(rate // 3, len(a) - j)
 if n <= 0: continue
 q=np.arange(n)/rate
 a[j:j+n]+=.08*np.sin(2*np.pi*80*q)*np.exp(-q*15)+.025*rng.normal(size=n)*np.exp(-q*40)
a*=np.minimum(t/3,1)*np.minimum((duration-t)/4,1);a=np.tanh(a)
stereo=np.column_stack((a,a*.98)).astype(np.float64)
p=pathlib.Path('storage/marketing/output');p.mkdir(parents=True,exist_ok=True)
with wave.open(str(p/'soundtrack.wav'),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(rate);f.writeframes((stereo*25000).astype('<i2').tobytes())
