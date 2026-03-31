import asyncio
from aiosmtpd.controller import Controller


class smtpHandler:

     async def handle_RCPT(self, server, session, envelope, address, rcpt_options):

        envelope.rcpt_tos.append(address)
        return '250 OK'
    

     async def handle_DATA(self, server, session, envelope):
        print(f'message from  {envelope.mail_from}')
        print(f'message for {envelope.rcpt_tos}')
        content = envelope.content.decode('utf-8', errors='replace')

        print(content)
        return '250 OK'
    

def start_smtp_server():
    controller=Controller(smtpHandler(),hostname='127.0.0.1',port=1025)
    print('starting smtp server')
    controller.start()

    try:
        input('press enter to stop server')
    except Exception:
        controller.stop()



if __name__=='__main__':
     try:
        asyncio.run(start_smtp_server())
     except KeyboardInterrupt:
        print("Server stopping...")




