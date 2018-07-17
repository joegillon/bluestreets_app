from cefpython3 import cefpython as cef
import sys
import threading
from server import run_server


def main():
    sys.excepthook = cef.ExceptHook
    settings = {}
    cef.Initialize(settings=settings)
    browser = cef.CreateBrowserSync(url='http://127.0.0.1:23948/',
                                    window_title="Bluestreets")
    cef.MessageLoop()
    cef.Shutdown()


if __name__ == '__main__':

    t = threading.Thread(target=run_server)
    t.daemon = True
    t.start()

    main()
