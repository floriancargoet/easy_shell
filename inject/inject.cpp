#include <napi.h>
#include <sys/ioctl.h>

void inject(std::string str) {
  for(char& c : str) {
    ioctl(0, TIOCSTI, &c);
  }
}

Napi::Value Inject(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() != 1) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsString()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::string arg0 = info[0].As<Napi::String>().Utf8Value();
  inject(arg0);

  return env.Null();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "inject"), Napi::Function::New(env, Inject));
  return exports;
}

NODE_API_MODULE(inject, Init)
