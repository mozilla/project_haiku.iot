#ifndef _MYPAGE_H_
#define _MYPAGE_H_
#include <string.h>
#include "softap_http.h"

class MyPage
{
public:
    const char* url;
    const char* mime_type;
    const char* data;
    static void display(const char* url, ResponseCallback* cb, void* cbArg, Reader* body, Writer* result, void* reserved);
};
#endif // _MYPAGE_H_
