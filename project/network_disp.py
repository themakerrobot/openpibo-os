def run():
  try:
    import subprocess
    from openpibo.oled import Oled

    v = subprocess.check_output(["/boot/get_network.sh"]).decode('utf-8').strip('\n').split(',')
    o = Oled()
    o.set_font(size=20)
    o.clear()
    o.set_font(size=12)
    eip = v[1] if v[0] == "" else v[0]
    wip = v[4] if v[2] == "" else v[2]
    ssid = v[5] if v[3] == "" else v[3]

    o.draw_text((0,0), "# NETWORK")
    o.draw_text((0,15), "[E]:{}".format(eip))
    o.draw_text((0,30), "[W]:{}".format(wip))
    o.draw_text((0,45), "[S]:{}".format(ssid))
    o.show()
    ret = True, ""
  except Exception as ex:
    ret = False, str(ex)
  finally:
    return ret
    
if __name__ == "__main__":
  run()
