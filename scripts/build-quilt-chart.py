"""Build the free, vector PDF. Requires reportlab. Run from any directory.
Optional YARDAGELAB_FONT_DIR points to Georgia TTFs; built-in fonts are the fallback.
Reference dimensions are shared with the website and calculator.
"""
import json, os
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public/downloads/yardagelab-quilt-size-chart.pdf'
DEST.parent.mkdir(parents=True, exist_ok=True)
sizes = json.loads((ROOT/'src/lib/quilt-sizes.json').read_text())
font_dir = Path(os.environ.get('YARDAGELAB_FONT_DIR', 'C:/Windows/Fonts'))
SERIF = 'Times-Roman'
if (font_dir/'georgia.ttf').exists():
    pdfmetrics.registerFont(TTFont('Georgia', str(font_dir/'georgia.ttf')))
    SERIF = 'Georgia'
INK, TEAL, RUST, LINE, PAPER = map(HexColor, ['#242B28','#24584F','#9A4D34','#D6D9CD','#F7F5EE'])
c = canvas.Canvas(str(DEST), pagesize=(612,792), pageCompression=1, invariant=1)
c.setTitle('YardageLab | Quilt Size Reference & Project Planner')
c.setAuthor('YardageLab')
c.setSubject('Approximate finished quilt sizes in inches and centimeters, plus a printable project planner')

def text(x,y,s,size=10,font='Helvetica',color=INK):
    c.setFillColor(color);c.setFont(font,size);c.drawString(x,y,s)
def rule(y):
    c.setStrokeColor(LINE);c.setLineWidth(.6);c.line(44,y,568,y)
def lines(x,y,items,size=10,leading=16,color=INK):
    for line in items: text(x,y,line,size,color=color); y-=leading
def base(page,tag):
    c.setFillColor(PAPER);c.rect(0,0,612,792,fill=1,stroke=0)
    text(44,749,'YARDAGELAB',12,'Helvetica-Bold',TEAL)
    text(395,749,'THE MAKER\'S REFERENCE',8,'Helvetica',TEAL)
    rule(733)
    rule(46);text(44,29,'yardagelab.me  /  Fabric math without the guesswork.',8,color=TEAL)
    text(510,29,f'{tag}  /  {page:02}',8,color=TEAL)
def quilt(x,y,w,h):
    # Restrained patchwork motif, entirely vector for clean printing.
    n=4;cell=w/n
    c.setFillColor(TEAL);c.rect(x,y,w,h,fill=1,stroke=0)
    for r in range(4):
      for col in range(4):
        xx=x+col*cell; yy=y+r*h/4
        c.setFillColor(HexColor('#CCD8C9') if (r+col)%2 else HexColor('#E7DCC5'))
        p=c.beginPath();p.moveTo(xx,yy);p.lineTo(xx+cell,yy);p.lineTo(xx,yy+h/4);p.close();c.drawPath(p,fill=1,stroke=0)
    c.setStrokeColor(PAPER);c.setLineWidth(1);c.rect(x,y,w,h,fill=0,stroke=1)

base(1,'REFERENCE')
text(44,682,'A quilt that fits.',34,SERIF)
lines(44,655,['Finished-size references for thoughtful planning.', 'Choose the coverage you want, then measure your space.'],11,18)
quilt(458,621,110,88)
text(44,592,'01  /  CHOOSE A STARTING SIZE',9,'Helvetica-Bold',TEAL)
c.setFillColor(TEAL);c.rect(44,547,524,30,fill=1,stroke=0)
for x,s in [(58,'QUILT'),(255,'INCHES'),(402,'CENTIMETERS*')]:text(x,558,s,9,'Helvetica-Bold',PAPER)
y=547
for i,s in enumerate(sizes):
    y-=40
    if i%2==0: c.setFillColor(HexColor('#EDEFE6'));c.rect(44,y,524,40,fill=1,stroke=0)
    text(58,y+15,s['name'],12,SERIF)
    text(255,y+15,f"{s['widthIn']} x {s['lengthIn']}",11)
    text(402,y+15,f"{s['widthIn']*2.54:.1f} x {s['lengthIn']*2.54:.1f}",11)
text(44,290,'* Centimeters rounded to one decimal. Dimensions are width x length.',8,color=TEAL)
lines(44,267,['These are approximate finished quilt sizes, not mattress measurements or universal',
              'standards. They match YardageLab\'s calculator references. Adjust for mattress depth,',
              'desired drop, pillow coverage and the pattern you are making.'],9,14)
rule(210)
text(44,187,'02  /  MAKE IT YOURS',9,'Helvetica-Bold',TEAL)
text(44,161,'Finished width = mattress width + twice the side drop',11,SERIF)
text(44,141,'Finished length = mattress length + foot drop + pillow allowance',11,SERIF)
lines(44,113,['Measure your bed rather than relying on its size name. Backing, batting and cutting',
             'allowances are additional. For babies, use this as a project-size reference only,',
             'not guidance on sleep bedding.'],9,14)
c.linkURL('https://yardagelab.me/guides/standard-quilt-sizes/',(44,18,360,42),relative=0)
c.showPage()

base(2,'PLANNER')
text(44,684,'From idea to cutting table.',29,SERIF)
text(44,656,'A quiet place to plan the details before the first cut.',11)
text(44,613,'PROJECT',8,'Helvetica-Bold',TEAL);rule(589)
text(350,613,'DATE / MAKER',8,'Helvetica-Bold',TEAL)
text(44,559,'01  /  FINISHED QUILT',9,'Helvetica-Bold',TEAL)
for y,label in [(530,'Width'),(499,'Length'),(468,'Block size / grid'),(437,'Sashing / borders')]:
    text(44,y,label,11,SERIF);c.setStrokeColor(LINE);c.line(175,y-3,330,y-3)
text(350,530,'UNITS',8,'Helvetica-Bold',TEAL)
for x,label in [(350,'inches'),(447,'cm')]:
    c.rect(x,500,9,9,fill=0,stroke=1);text(x+16,500,label,10)
lines(350,469,['Use finished block dimensions.', 'Add seam allowances separately', 'when preparing cutting sizes.'],9,15)
rule(410)
text(44,385,'02  /  FABRIC & FINISHING',9,'Helvetica-Bold',TEAL)
for y,label in [(356,'Usable fabric width'),(325,'Backing overhang / side'),(294,'Seam allowance'),(263,'Binding strip width')]:
    text(44,y,label,11,SERIF);c.setStrokeColor(LINE);c.line(225,y-3,330,y-3)
for y,label in [(356,'Directional print'),(325,'Prewash / shrinkage'),(294,'Pattern repeat'),(263,'Quilter requirements checked')]:
    c.rect(350,y-1,9,9,fill=0,stroke=1);text(367,y,label,9)
rule(238)
text(44,213,'03  /  PURCHASE NOTES',9,'Helvetica-Bold',TEAL)
for y in [183,158,133]:rule(y)
lines(44,104,['Calculate backing and binding separately at yardagelab.me/quilting/.',
             'Keep exact requirements separate from purchase rounding and any extra buffer.'],9,14)
c.linkURL('https://yardagelab.me/quilting/',(44,84,530,118),relative=0)
c.save()
print(DEST)
