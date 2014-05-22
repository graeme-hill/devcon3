using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    public class Program
    {
        static void Main(string[] args)
        {
            var task = new Task(RunTest8);
            task.Start();
            task.Wait();

            Console.ReadKey();
        }

        /****************************************************************
         * DEMO FUNCTIONS
         ****************************************************************/

        // each action blocks the following actions
        private static void RunTest1()
        {
            using (new MyTimer("TEST"))
            {
                GetSlowThingWithLotsOfCPU();
                GetSlowThingWithLotsOfCPU();
                GetSlowThingWithLotsOfCPU();
            }
        }

        // nothing is blocking
        private static void RunTest2()
        {
            using (new MyTimer("TEST"))
            {
                GetSlowThingWithLotsOfCPUAsTask();
                GetSlowThingWithLotsOfCPUAsTask();
                GetSlowThingWithLotsOfCPUAsTask();
            }
        }

        // now they're all blocking each other again
        private static async void RunTest3()
        {
            using (new MyTimer("TEST"))
            {
                await GetSlowThingWithLotsOfCPUAsTask();
                await GetSlowThingWithLotsOfCPUAsTask();
                await GetSlowThingWithLotsOfCPUAsTask();
            }
        }

        // now it only waits at the end
        private static async void RunTest4()
        {
            using (new MyTimer("TEST"))
            {
                var task1 = GetSlowThingWithLotsOfCPUAsTask();
                var task2 = GetSlowThingWithLotsOfCPUAsTask();
                var task3 = GetSlowThingWithLotsOfCPUAsTask();
                await Task.WhenAll(task1, task2, task3);
            }
        }

        // let's make a whole bunch of manual threads
        private static void RunTest5()
        {
            using (new MyTimer("TEST"))
            {
                var threads = new List<Thread>();
                for (var i = 0; i < 50; i++)
                {
                    var thread = new Thread(new ThreadStart(GetSlowThingWithLotsOfCPU));
                    threads.Add(thread);
                    thread.Start();
                }
                threads.ForEach(th => th.Join());
            }
        }

        // the same things with tasks
        private static async void RunTest6()
        {
            using (new MyTimer("TEST"))
            {
                var tasks = new List<Task>();
                for (var i = 0; i < 50; i++)
                {
                    tasks.Add(GetSlowThingWithLotsOfCPUAsTask());
                }
                await Task.WhenAll(tasks.ToArray());
            }
        }

        // something that takes time but uses almost no CPU using tasks
        private static async void RunTest7()
        {
            using (new MyTimer("TEST"))
            {
                var tasks = new List<Task>();
                for (var i = 0; i < 50; i++)
                {
                    tasks.Add(GetVesselsAsync());
                }
                await Task.WhenAll(tasks.ToArray());
            }
        }

        // same thing with manual threads
        private static void RunTest8()
        {
            using (new MyTimer("TEST"))
            {
                var threads = new List<Thread>();
                for (var i = 0; i < 100; i++)
                {
                    var thread = new Thread(new ThreadStart(() => GetVessels()));
                    threads.Add(thread);
                    thread.Start();
                }
                threads.ForEach(th => th.Join());
            }
        }

        /****************************************************************
         * HELPER FUNCTIONS
         ****************************************************************/

        private static void GetSlowThingWithLotsOfCPU()
        {
            using (new MyTimer("calculating a guid "))
            {
                Guid guid = Guid.Empty;
                for (var i = 0; i < 5000000; i++)
                {
                    guid = Guid.NewGuid();
                }
            }
        }

        private static Task GetSlowThingWithLotsOfCPUAsTask()
        {
            return Task.Factory.StartNew(() => GetSlowThingWithLotsOfCPU());
        }

        private static Task Sleep(int millis)
        {
            return Task.Factory.StartNew(() => Thread.Sleep(millis));
        }

        private static async Task<string> GetVesselsAsync()
        {
            using (new MyTimer("API call"))
            {
                await Sleep(1000);
                return "[ { \"name\": \"edoc destroyer\" } ]";
            }
        }

        private static string GetVessels()
        {
            using (new MyTimer("API call"))
            {
                Thread.Sleep(1000);
                return "[ { \"name\": \"edoc destroyer\" } ]";
            }
        }
    }

    public class MyTimer : IDisposable
    {
        private DateTime _start;
        private string _name;

        public MyTimer(string name)
        {
            _name = name;
            _start = DateTime.Now;
            Console.WriteLine(_name + " started");
        }

        public void Dispose()
        {
            var diff = DateTime.Now - _start;
            Console.WriteLine(_name + " took " + diff.TotalMilliseconds + " milliseconds");
        }
    }
}
