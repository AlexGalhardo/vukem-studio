"""Validate delivery media and retain reproducible measurements."""
import json, subprocess, pathlib, hashlib, os
ffmpeg=os.environ.get('FFMPEG','ffmpeg')
ffprobe=os.environ.get('FFPROBE','ffprobe')
root=pathlib.Path('storage/marketing/output')
scenes=json.loads(pathlib.Path('scripts/film/scenes.json').read_text())
expected=sum(float(scene['seconds']) if scene.get('seconds') else 8 for scene in scenes)
reports=[]
for fmt,size in [('horizontal',(1920,1080)),('vertical',(1080,1920))]:
 p=root/f'vukem-launch-{fmt}.mp4'
 probe=json.loads(subprocess.check_output([ffprobe,'-v','error','-show_streams','-show_format','-of','json',str(p)],timeout=60))
 v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
 assert (v['width'],v['height'])==size
 assert v['pix_fmt']=='yuv420p' and v['codec_name']=='h264' and v['r_frame_rate']=='30/1'
 assert a['codec_name']=='aac' and a['channels']==2
 assert abs(float(probe['format']['duration'])-expected)<.2
 data=p.read_bytes()
 atoms=[];offset=0
 while offset+8<=len(data):
  size=int.from_bytes(data[offset:offset+4], 'big');kind=data[offset+4:offset+8]
  if size==1:size=int.from_bytes(data[offset+8:offset+16], 'big')
  if size==0:size=len(data)-offset
  assert size>=8 and offset+size<=len(data)
  atoms.append(kind);offset+=size
 assert atoms.index(b'moov')<atoms.index(b'mdat')
 measured=subprocess.run([ffmpeg,'-hide_banner','-nostats','-i',str(p),'-vn','-af','loudnorm=print_format=json','-f','null','-'],capture_output=True,text=True,timeout=180,check=True).stderr
 loud,_=json.JSONDecoder().raw_decode(measured[measured.rfind('{'):]);assert -16<=float(loud['input_i'])<=-12 and float(loud['input_tp'])<=-1.5
 subprocess.run([ffmpeg,'-v','error','-xerror','-i',str(p),'-f','null','-'],check=True,timeout=300)
 report={'file':str(p),'sha256':hashlib.sha256(data).hexdigest(),'probe':probe,'loudness':loud,'faststart':True,'fullDecode':True}
 (root/f'{fmt}-qa.json').write_text(json.dumps(report,indent=2));reports.append({'format':fmt,'duration':probe['format']['duration'],'lufs':loud['input_i'],'truePeak':loud['input_tp']})
print(json.dumps(reports,indent=2))
