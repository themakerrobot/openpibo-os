def run():
  try:
    import subprocess
    from openpibo.oled import Oled

    v = subprocess.check_output(["/home/pi/openpibo-files/system/get_network.sh"]).decode('utf-8').strip('\n').split(',')
    o = Oled()
    o.set_font(size=12)
    wip, ssid, sn = v[2] if v[0] == "" else v[0], v[3] if v[1] == "" else v[1], v[4]
    o.draw_text((0, 5), "SN: {}".format(sn))
    o.draw_text((0,25), "I P: {}".format(wip.strip()))
    o.draw_text((0,45), "AP: {}".format(ssid))
    o.show()
    ret = True, ""
  except Exception as ex:
    ret = False, str(ex)
  finally:
    return ret
    
if __name__ == "__main__":
  print(run())
