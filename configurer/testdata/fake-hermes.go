// A deliberately fake installed Hermes CLI for isolated installer tests only.
package main
import("encoding/json";"fmt";"os";"path/filepath";"strings")
func main(){
 h:=os.Getenv("HERMES_HOME");a:=os.Args[1:]
 if len(a)==2&&a[0]=="config" {if a[1]=="path"{fmt.Println(filepath.Join(h,"config.yaml"));return};if a[1]=="env-path"{fmt.Println(filepath.Join(h,".env"));return}}
 if len(a)==4&&a[0]=="config"&&a[1]=="set" {if a[2]=="model"||strings.HasPrefix(a[2],"model."){os.Exit(4)};if a[2]=="HERMES_CUSTOM_AIZAMIN_API_KEY"{os.WriteFile(filepath.Join(h,".env"),[]byte(a[2]+"="+a[3]+"\n"),0600)}}
 f,e:=os.OpenFile(filepath.Join(h,"fake-cli-calls.jsonl"),os.O_CREATE|os.O_APPEND|os.O_WRONLY,0600);if e!=nil{panic(e)};defer f.Close();json.NewEncoder(f).Encode(a)
}
