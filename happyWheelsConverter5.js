// Wesley Daugherty
// wcd5f

from svgpathtools import svg2paths
from PIL import Image as PIL_Image
import time
from svg.path import parse_path
import copy
from xml.dom import minidom
import tkinter
from tkinter import *
from tkinter import scrolledtext
from tkinter import ttk
from tkinter.filedialog import askopenfilename
from tkinter.simpledialog import *
import os
from math import ceil



// Tools you can use:
// Inkscape
// vectorizer.io
// pngtosvg.com


// Enter your image name here (the svg file exported from Inkscape or another program)
svg_file = ''

// Enter your image name here (the original image before you vectorized it)
orig_file = ''

// Enter your output text file name here
output_File = ''

// This is the pixel sample size. A larger number means the output will be lower resolution.
old_Pixel_Size = 1

// This is the size of each pixel in HW.
new_Pixel_Size = 1

override_im_dims = False
max_x = 100
max_y = 100

// These are your position offset values. You don't really need to mess with these.
offset_x = 400
offset_y = 5200

// This probably won't make much sense, but I'll try to explain briefly. Essentially, when you copy/paste between levels,
// the shape ID numbers are preserved, which will cause a conflict if there are multiple shapes with the same ID #
// To avoid this, figure out what the highest shape ID number is in your level, and then set the ID offset to a number above that
id_offset = 0



#_____START OF CODE________DO NOT MESS WITH ANYTHING BELOW_____________________________________________

cwd = os.getcwd()
window = Tk()
window.title("Vector Image Converter")
window.geometry('600x500')
window.resizable(FALSE,FALSE)

#This is where we lauch the file manager bar.
def OpenFile():
    name = askopenfilename(initialdir=cwd,
                           filetypes =(("Text File", "*.txt"),("All Files","*.*")),
                           title = "Choose a file."
                           )
    print (name)
    #Using try in case user types in unknown file or closes without choosing a file.
    try:
        with open(name,'r') as UseFile:
            print(UseFile.read())
    except:
        print("No file exists")


#Menu Bar

menu = Menu(window)
window.config(menu=menu)
file = Menu(menu)
# file.add_command(label = 'Open', command = OpenFile)
file.add_command(label = 'Exit', command = lambda:exit())
menu.add_cascade(label = 'File', menu = file)



def myfunction(event):
    canvas.configure(scrollregion=canvas.bbox("all"),width=400,height=200)

myframe=Frame(window,relief=GROOVE,width=50,height=100,bd=1)
myframe.grid(sticky="W",column=0, row=0,padx=10,pady=10)

canvas=Canvas(myframe)
frame=Frame(canvas)
myscrollbar=Scrollbar(myframe,orient="vertical",command=canvas.yview)
canvas.configure(yscrollcommand=myscrollbar.set)

def set_svg_file():
    global svg_file
    name = askopenfilename(initialdir=cwd,
                           filetypes=(("SVG File", "*.svg"),),
                           title="Choose a file."
                           )
    try:
        if name != '':
            l1_2['text'] = name
            svg_file = name
        else:
            svg_file = ''
            l1_2['text'] = 'None selected'
    except:
        print("No file exists")

def set_im_file():
    global orig_file
    name = askopenfilename(initialdir=cwd,
                           filetypes=(("PNG File", "*.png"),("JPG File", "*.jpg"),("GIF File", "*.gif"),("All Files","*")),
                           title="Choose a file."
                           )
    try:
        if name != '':
            l2_2['text'] = name
            orig_file = name
        else:
            orig_file = ''
            l2_2['text'] = 'None selected'
    except:
        print("No file exists")

def set_txt_file():
    global output_File
    name = askopenfilename(initialdir=cwd,
                           filetypes=(("TXT File", "*.txt"),),
                           title="Choose a file."
                           )
    try:
        if name != '':
            l3_2['text'] = name
            output_File = name
        else:
            output_File = ''
            l3_2['text'] = 'None selected'
    except:
        print("No file exists")

myscrollbar.pack(side="right",fill="y")
canvas.pack(side="left")
canvas.create_window((0,0),window=frame,anchor='nw')
frame.bind("<Configure>",myfunction)
l1 = Label(frame, text="SVG File")
l1.grid(sticky="W", column=0, row=0, padx=2, pady=2)
l1_2 = Label(frame, text="None selected")
l1_2.grid(sticky="W", column=1, row=1, padx=2, pady=2)
btn1 = Button(frame, text="Browse", command=set_svg_file)
btn1.grid(sticky="W", column=0, row=1, padx=2, pady=2)
l2 = Label(frame, text="Original Image")
l2.grid(sticky="W", column=0, row=2, padx=2, pady=10)
l2_2 = Label(frame, text="None selected")
l2_2.grid(sticky="W", column=1, row=3, padx=2, pady=2)
btn2 = Button(frame, text="Browse", command=set_im_file)
btn2.grid(sticky="W", column=0, row=3, padx=2, pady=2)
l3 = Label(frame, text="Output Text File")
l3.grid(sticky="W", column=0, row=4, padx=2, pady=10)
l3_2 = Label(frame, text="None selected")
l3_2.grid(sticky="W", column=1, row=5, padx=2, pady=2)
btn3 = Button(frame, text="Browse", command=set_txt_file)
btn3.grid(sticky="W", column=0, row=5, padx=2, pady=2)
l4 = Label(frame, text="Scale Factor")
l4.grid(sticky="W", column=0, row=6, padx=2, pady=10)
txt4 = Entry(frame, width=30, text="Scale")
txt4.grid(sticky="W", column=0, row=7, padx=2, pady=2)
txt4.insert(INSERT,'1')
l5 = Label(frame, text="ID Offset")
l5.grid(sticky="W", column=0, row=8, padx=2, pady=10)
txt5 = Entry(frame, width=30, text="ID Offset")
txt5.grid(sticky="W", column=0, row=9, padx=2, pady=2)
txt5.insert(INSERT,'0')
oid = tkinter.IntVar()
c6 = Checkbutton(frame, text="Override Image Dimensions",variable=oid)
c6.grid(sticky="W", column=0, row=10, padx=2, pady=10)
txt6 = Entry(frame, width=10, text="X")
txt6.grid(sticky="W", column=0, row=11, padx=2, pady=2)
txt6.insert(INSERT,'100')
txt6_2 = Entry(frame, width=10, text="Y")
txt6_2.grid(sticky="W", column=0, row=12, padx=2, pady=2)
txt6_2.insert(INSERT,'100')

warnings = {0: 'None', 1: 'No SVG file chosen', 2: 'No Image file chosen', 3: 'No output file chosen', 4: 'Scale factor invalid', 5: 'ID offset '
                                                                                                                                     'invalid',
            6: 'Override dimensions invalid', 7: 'Original dimensions too small', 8: 'Invalid file'}
my_warnings = []

def hex_to_rgb(value):
    value = value.lstrip('#')
    lv = len(value)
    return tuple(int(value[i:i + lv // 3], 16) for i in range(0, lv, lv // 3))


def rgb_to_hex(rgb):
    return '#%02x%02x%02x' % rgb

def get_percent_complete(my_time,my_num,tot_num):
    # percentage = int(my_num/tot_num*100)
    # print(percentage,'%')
    print('Still working...')

def write_to_file():
    global id_offset,svg_file,orig_file,output_File,old_Pixel_Size,new_Pixel_Size,override_im_dims,max_x,max_y
    bad_entry = False
    warning = 0
    my_warnings.clear()
    my_xml = ''
    btn7['state'] = 'disabled'
    scr.delete('1.0', END)
    if svg_file == '' or svg_file == None:
        bad_entry = True
        warning = 1
        my_warnings.append(warning)
    if (orig_file == '' or orig_file == None) and oid.get() == 0:
        bad_entry = True
        warning = 2

        my_warnings.append(warning)
    if output_File == '' or output_File == None:
        bad_entry = True
        warning = 3
        my_warnings.append(warning)
    scale_text = txt4.get()
    sc = 1
    try:
        sc = float(scale_text)
        old_Pixel_Size = 1
        new_Pixel_Size = sc
    except:
        bad_entry = True
        warning = 4
        my_warnings.append(warning)
    id_text = txt5.get()
    idn = 0
    try:
        idn = abs(int(float(id_text)))
        id_offset = idn
    except:
        bad_entry = True
        warning = 5
        my_warnings.append(warning)
    if oid.get() == 1:
        override_im_dims = True
        xt = txt6.get()
        x1 = 100
        yt = txt6_2.get()
        y1 = 100
        try:
            x1 = abs(int(float(xt)))
            y1 = abs(int(float(yt)))
            max_x = x1
            max_y = y1
        except:
            bad_entry = True
            warning = 6
            my_warnings.append(warning)
    else:
        override_im_dims = False

    start_time = int(time.time())
    # print(start_time)
    next_time = start_time + 5
    cur_id = id_offset

    x = max_x
    y = max_y
    if not override_im_dims:
        try:
            im = PIL_Image.open(orig_file, 'r')
            x = im.size[0]
            y = im.size[1]
        except:
            bad_entry = True
            warning = 8
            my_warnings.append(warning)

    if not bad_entry:
        datafile = None
        try:
            datafile = open(output_File, "w")
        except:
            bad_entry = True
            warning = 8
            my_warnings.append(warning)
        text_a = ('<levelXML> \n <info v="1.87" x="300" y="5100" c="11" f="f" h="f" bg="0" bgc="16777215" e="1"/> \n <groups>\n'
                       '    <g x="' + str(round(offset_x + x / 2 * new_Pixel_Size / old_Pixel_Size - new_Pixel_Size / 2, 2)) + '" y="' + str(round(
            offset_y + y / 2 * new_Pixel_Size / old_Pixel_Size - new_Pixel_Size / 2, 2)) + '" r="0" ox="-' + str(round(
            offset_x + x / 2 * new_Pixel_Size / old_Pixel_Size - new_Pixel_Size / 2, 2)) + '" oy="-' + str(round(
            offset_y + y / 2 * new_Pixel_Size / old_Pixel_Size - new_Pixel_Size / 2, 2)) +
                       '" s="f" f="f" o="100" im="f" fr="f"> \n')
        datafile.write(text_a)
        my_xml += text_a

        print('Drawing shapes...')

        doc = None
        try:
            doc = minidom.parse(svg_file)  # parseString also exists
        except:
            bad_entry = True
            warning = 8
            my_warnings.append(warning)

        if not bad_entry:
            path_strings = [path.getAttribute('d') for path
                            in doc.getElementsByTagName('path')]
            g_strings = doc.getElementsByTagName('g')
            use_g = False
            if len(g_strings) > 0:
                use_g = True

            paths, attributes = svg2paths(svg_file)

            colors = []
            opacities = []
            if use_g:
                paths.clear()
                for g in g_strings:
                    cur_paths = g.getElementsByTagName('path')
                    cur_col = g.getAttribute('fill')
                    cur_op = g.getAttribute('opacity')
                    if len(cur_op) < 1:
                        cur_op = 'Null'
                    if len(cur_col) < 1:
                        cur_col = 'Null'
                    for c in range(len(cur_paths)):
                        colors.append(cur_col)
                        opacities.append(cur_op)


            t = 0
            u = 0
            for r in paths:
                t += len(paths)
            max_ext = [0, 0]
            for i in range(len(attributes)):

                my_attr = attributes[i]
                my_path = parse_path(my_attr['d'])
                # print(my_attr)
                my_style = my_attr.get('style','Null')
                my_fill = 'Null'
                my_opacity = 'Null'
                if not use_g:
                    if my_style == 'Null':
                        my_fill = my_attr.get('fill','Null')
                        if my_fill == 'Null':
                            my_fill = '#000000'
                        my_opacity = my_attr.get('fill-opacity', 'Null')
                    else:
                        style_temp = my_style.split(';')
                        for s in style_temp:
                            s_temp = s.split(':')
                            if 'fill' in s_temp[0]:
                                my_fill = s_temp[1]
                            elif 'opacity' in s_temp[0]:
                                my_opacity = s_temp[1]
                else:
                    try:
                        my_fill = colors[i]
                        my_opacity = opacities[i]
                    except:
                        my_fill = '#000000'
                        my_opacity = '1'
                    if my_style == 'Null' and my_fill == 'Null':
                        my_fill = my_attr.get('fill','Null')
                        if my_fill == 'Null':
                            my_fill = '#000000'
                        my_opacity = my_attr.get('fill-opacity', 'Null')
                    else:
                        style_temp = my_style.split(';')
                        for s in style_temp:
                            s_temp = s.split(':')
                            if 'fill' in s_temp[0]:
                                my_fill = s_temp[1]
                            elif 'opacity' in s_temp[0]:
                                my_opacity = s_temp[1]


                if my_opacity == 'Null':
                    my_opacity = str(100)
                else:
                    my_opacity = str(float(my_opacity)*100)
                # print(my_opacity)
                # print(my_fill)
                my_fill = hex_to_rgb(my_fill)
                my_color = 256*256*my_fill[0] + 256*my_fill[1] + my_fill[2]


                cur_ext = [0, 0]
                num_verts = 0
                all_paths = []
                cur_path = []
                all_exts = []
                for p in my_path:
                    p_str = str(p)
                    if (p.start.real > max_ext[0]):
                        max_ext[0] = p.start.real
                    if (p.start.imag > max_ext[1]):
                        max_ext[1] = p.start.imag
                    if 'Move' in p_str:
                        # print('Move')
                        if p != my_path[0]:
                            all_paths.append(copy.deepcopy(cur_path))
                            all_exts.append(copy.deepcopy(cur_ext))
                            cur_path.clear()
                            cur_ext = [0,0]
                            num_verts += 2
                        cur_path.append(p)
                        if (p.start.real > cur_ext[0]):
                            cur_ext[0] = p.start.real
                        if (p.start.imag > cur_ext[1]):
                            cur_ext[1] = p.start.imag
                    elif 'Line' in p_str:
                        # print('Line')
                        cur_path.append(p)
                        num_verts += 1
                        if (p.start.real > cur_ext[0]):
                            cur_ext[0] = p.start.real
                        if (p.start.imag > cur_ext[1]):
                            cur_ext[1] = p.start.imag
                    elif 'CubicBezier' in p_str:
                        # print('CubicBezier')
                        cur_path.append(p)
                        num_verts += 1
                        if (p.start.real > cur_ext[0]):
                            cur_ext[0] = p.start.real
                        if (p.start.imag > cur_ext[1]):
                            cur_ext[1] = p.start.imag
                    else:
                        print(p)
                        raise ValueError('Unrecognized curve type. Output will not be correct.')
                else:
                    all_paths.append(copy.deepcopy(cur_path))
                    all_exts.append(copy.deepcopy(cur_ext))
                    cur_path.clear()
                    cur_ext = [0, 0]


                cur_id += 1

                shape_text = '<sh t="4" i="f" p0="' + str(round(offset_x, 2)) + '" p1="' + str(round(offset_y, 2)) + '" p2="' + str(round(
                    x * new_Pixel_Size / old_Pixel_Size, 2)) + \
                             '" p3="' + str(round(y * new_Pixel_Size / old_Pixel_Size, 2)) + '" p4="0" p5="f" p6="f" p7="1" p8="' + str(my_color) + \
                             '" p9="-1" p10="' + my_opacity + '" p11="1">  \n    <v f="t" id="' + str(cur_id) + '" n="' + str(num_verts+5) + '"'
                shape_text_3 = ""
                orig_pt = []
                cur_orig_pt = []
                cur_last_p = None
                f = new_Pixel_Size / old_Pixel_Size
                n = -1
                for j in range(len(all_paths)):
                    for q in range(len(all_paths[j])):
                        u += 1
                        if (int(time.time()) - next_time) > 0:
                            get_percent_complete(int(time.time()), u, t)
                            next_time = int(time.time()) + 5
                        if q != 0:
                            n += 1
                            my_p = all_paths[j][q]
                            prev = q - 1
                            if q == 1:
                                prev = -1
                            my_prev_p = all_paths[j][prev]
                            my_prev_p_str = str(my_prev_p)
                            bez_flag = False
                            if 'CubicBezier' in my_prev_p_str:
                                if q != 1:
                                    bez_flag = True
                            shape_text_3 += ' v' + str(n) + '="'
                            my_p_str = str(my_p)
                            if 'Line' in my_p_str:
                                if bez_flag:
                                    shape_text_3 += str(round(my_p.start.real*f, 2)) + '_' + str(round(my_p.start.imag*f, 2)) + '_' + \
                                                    str(round((my_prev_p.control2.real - my_p.start.real)*f, 2)) + '_' + str(round(
                                        (my_prev_p.control2.imag - my_p.start.imag)*f, 2)) + '_' + str(
                                        0) + '_' + str(0) + '"'
                                else:
                                    shape_text_3 += str(round(my_p.start.real*f, 2)) + '_' + str(round(my_p.start.imag*f, 2)) + '"'
                            elif 'CubicBezier' in my_p_str:
                                if bez_flag:
                                    shape_text_3 += str(round(my_p.start.real*f, 2)) + '_' + str(round(my_p.start.imag*f, 2)) + '_' + \
                                                    str(round((my_prev_p.control2.real - my_p.start.real)*f, 2)) + '_' + str(round(
                                        (my_prev_p.control2.imag - my_p.start.imag)*f, 2)) + '_' + str(round(
                                        (my_p.control1.real - my_p.start.real)*f, 2)) + '_' + str(round((my_p.control1.imag - my_p.start.imag)*f, 2)) + '"'
                                else:
                                    shape_text_3 += str(round(my_p.start.real*f, 2)) + '_' + str(round(my_p.start.imag*f, 2)) + '_' + \
                                                    str(0) + '_' + str(
                                        0) + '_' + str(round(
                                        (my_p.control1.real - my_p.start.real)*f, 2)) + '_' + str(round((my_p.control1.imag - my_p.start.imag)*f, 2)
                                                                                                        ) + '"'
                            cur_last_p = my_p
                        else:
                            my_p = all_paths[j][q]
                            if j == 0:
                                orig_pt = [my_p.start.real,my_p.start.imag]
                                cur_orig_pt = [my_p.start.real, my_p.start.imag]
                            else:
                                shape_text_3 += ' v' + str(n+1) + '="'
                                my_p_str = str(cur_last_p)
                                if 'Line' in my_p_str:
                                    shape_text_3 += str(round(cur_orig_pt[0]*f, 2)) + '_' + str(round(cur_orig_pt[1]*f, 2)) + '"'
                                elif 'CubicBezier' in my_p_str:
                                    shape_text_3 += str(round(cur_orig_pt[0]*f, 2)) + '_' + str(round(cur_orig_pt[1]*f, 2)) + '_' + \
                                                        str(round((cur_last_p.control2.real - cur_orig_pt[0])*f, 2)) + '_' + str(round(
                                        (cur_last_p.control2.imag - cur_orig_pt[1])*f, 2)) + '_' + str(
                                            0) + '_' + str(0) + '"'
                                shape_text_3 += ' v' + str(n+2) + '="'
                                shape_text_3 += str(round(orig_pt[0]*f, 2)) + '_' + str(round(orig_pt[1]*f, 2)) + '"'
                                n += 2
                                cur_orig_pt = [my_p.start.real,my_p.start.imag]
                else:
                    shape_text_3 += ' v' + str(n + 1) + '="'
                    my_p_str = str(cur_last_p)
                    if 'Line' in my_p_str:
                        shape_text_3 += str(round(cur_orig_pt[0]*f, 2)) + '_' + str(round(cur_orig_pt[1]*f, 2)) + '"'
                    elif 'CubicBezier' in my_p_str:
                        shape_text_3 += str(round(cur_orig_pt[0]*f, 2)) + '_' + str(round(cur_orig_pt[1]*f, 2)) + '_' + \
                                        str(round((cur_last_p.control2.real - cur_orig_pt[0])*f, 2)) + '_' + str(round(
                            (cur_last_p.control2.imag - cur_orig_pt[1])*f, 2)) + '_' + str(
                            0) + '_' + str(0) + '"'
                    shape_text_3 += ' v' + str(n + 2) + '="'
                    shape_text_3 += str(round(orig_pt[0] * f, 2)) + '_' + str(round(orig_pt[1] * f, 2)) + '"'
                    shape_text_3 += ' v' + str(n + 3) + '="'
                    shape_text_3 += str(round(x * f, 2)) + '_' + str(round(y * f, 2)) + '"'
                    shape_text_3 += ' v' + str(n + 4) + '="'
                    shape_text_3 += str(round(orig_pt[0] * f, 2)) + '_' + str(round(orig_pt[1] * f, 2)) + '"'
                    shape_text_3 += ' v' + str(n + 5) + '="'
                    shape_text_3 += str(0) + '_' + str(0) + '"'
                shape_text_3 += '/>  \n  </sh> \n'
                write_text = shape_text + shape_text_3
                datafile.write(write_text)
                my_xml += write_text
            datafile.write('</g>\n')
            datafile.write('</groups>\n </levelXML>')
            my_xml += '</g>\n</groups>\n </levelXML>'
            datafile.close()
            if max_ext[0] > x or max_ext[1] > y:
                warning = 7
                print('Error - SVG dimensions are larger than image dimensions - Please use the following to override: ',max_ext)
                warnings[7] = 'Original dimensions too small. Override dimensions with:  ' +str(ceil(max_ext[0])) + ', ' + str(ceil(max_ext[1]))
    print('Process completed in',int(time.time()-start_time),'seconds')
    warn_text = 'Warnings: '+warnings[warning]
    if warning != 0:
        scr.insert(INSERT,'XML unavailable - please fix all errors')
        for w in range(len(my_warnings)-2,-1,-1):
            warn_text += '\n'+warnings[my_warnings[w]]
    else:
        scr.insert(INSERT,my_xml)
    # print(warn_text)
    # print(bad_entry)
    l7['text'] = warn_text
    btn7['state'] = 'normal'

btn7 = Button(window, text="Convert", command=write_to_file)
btn7.grid(sticky="W", column=0, row=1, padx=10, pady=10)
l7 = Label(window, text="Warnings: None")
l7.grid(sticky="W", column=0, row=2, padx=2, pady=2)
scr = scrolledtext.ScrolledText(window,width=60,height=10)
scr.grid(sticky="W",column=0, row=3,padx=10,pady=10)
scr.insert(INSERT,"Output for your xml")

window.mainloop()

